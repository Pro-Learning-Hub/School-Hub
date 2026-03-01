import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import ImageKit from 'imagekit';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';

@Injectable()
export class AuthService {
  private imagekit: ImageKit;

  constructor(
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {
    this.imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
      urlEndpoint: process.env.IMAGEKIT_ENDPOINT || '',
    });
  }

  private formatUserResponse(user: any) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      pictureThumbnail: user.pictureThumbnail,
      pictureUrl: user.pictureUrl,
    };
  }

  async login(dto: LoginDto) {
    const { email, password, courseId } = dto;
    const [user] = await this.dataSource.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) throw new UnauthorizedException('Email not found');
    if (!user.passwordHash && user.googleId) {
      throw new UnauthorizedException('Account registered with Google. Please use Google login');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException(user.googleId ? 'Wrong password. You can still use Google login.' : 'Wrong password');
    }

    if (courseId) {
      const [enrollment] = await this.dataSource.query(
        'SELECT * FROM courseEnrollments WHERE userId = ? AND courseId = ?',
        [user.id, courseId],
      );
      if (!enrollment) throw new ForbiddenException('User is not enrolled in the course');
    }

    const accessToken = this.jwtService.sign({ userId: user.id, courseId, role: user.role });
    return { message: 'Logged in successfully', accessToken, user: this.formatUserResponse(user) };
  }

  async register(dto: RegisterDto) {
    const { userData, courseId } = dto;
    const { email, password, firstName, lastName, username, pictureId, pictureURL, pictureThumbnail } = userData;

    const [existingUser] = await this.dataSource.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) throw new ConflictException('Email already exists');

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);

    await this.dataSource.query(
      'INSERT INTO users (id, email, passwordHash, firstName, lastName, username, pictureId, pictureUrl, pictureThumbnail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, email, passwordHash, firstName, lastName, username || null, pictureId || null, pictureURL || null, pictureThumbnail || null],
    );

    if (courseId) {
      await this.dataSource.query(
        'INSERT INTO courseEnrollments (userId, courseId) VALUES (?, ?)',
        [id, courseId],
      );
    }

    const accessToken = this.jwtService.sign({ userId: id, courseId, role: 'student' });
    return {
      accessToken,
      user: { id, email, firstName, lastName, username, pictureThumbnail, pictureUrl: pictureURL, role: 'student' },
      message: 'User created successfully',
    };
  }

  async googleLogin(dto: GoogleAuthDto) {
    const { token: idToken, courseId } = dto;
    const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;

    const response = await fetch(googleVerifyUrl);
    const data = await response.json();
    if (!data.email_verified) throw new UnauthorizedException('Email not verified');

    const [user] = await this.dataSource.query('SELECT * FROM users WHERE email = ?', [data.email]);
    if (!user) throw new UnauthorizedException('User not found');

    if (!user.googleId) {
      await this.dataSource.query('UPDATE users SET googleId = ? WHERE email = ?', [data.sub, data.email]);
    }

    if (courseId) {
      const [enrollment] = await this.dataSource.query(
        'SELECT 1 FROM courseEnrollments WHERE userId = ? AND courseId = ?',
        [user.id, courseId],
      );
      if (!enrollment) throw new ForbiddenException('User is not enrolled in this course');
    }

    const accessToken = this.jwtService.sign({ userId: user.id, courseId, role: user.role });
    return { message: 'Logged in successfully', accessToken, user: this.formatUserResponse(user) };
  }

  async googleRegister(dto: GoogleAuthDto) {
    const { token: idToken, courseId } = dto;
    const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;

    const response = await fetch(googleVerifyUrl);
    const userData = await response.json();

    if (!response.ok) throw new UnauthorizedException('Error connecting to Google');
    if (userData.error) throw new UnauthorizedException(`${userData.error}: ${userData.error_description}`);
    if (!userData.email_verified) throw new UnauthorizedException('Email not verified');

    const [existingUser] = await this.dataSource.query('SELECT id FROM users WHERE email = ?', [userData.email]);
    if (existingUser) throw new ConflictException('Email already exists');

    const userId = uuidv4();
    await this.dataSource.query(
      'INSERT INTO users (id, googleId, email, firstName, lastName, pictureUrl, pictureThumbnail) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, userData.sub, userData.email, userData.given_name, userData.family_name, userData.picture, userData.picture],
    );

    if (courseId) {
      await this.dataSource.query(
        'INSERT INTO courseEnrollments (userId, courseId) VALUES (?, ?)',
        [userId, courseId],
      );
    }

    const accessToken = this.jwtService.sign({ userId, courseId, role: 'student' });
    return {
      accessToken,
      user: {
        id: userId,
        email: userData.email,
        role: 'student',
        firstName: userData.given_name,
        lastName: userData.family_name,
        pictureThumbnail: userData.picture,
        pictureUrl: userData.picture,
      },
      message: 'User registered and logged in successfully',
    };
  }

  async adminLogin(dto: LoginDto) {
    const { email, password, courseId } = dto;
    const [user] = await this.dataSource.query(
      'SELECT * FROM users WHERE email = ? AND role = ?',
      [email, 'admin'],
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException('Wrong password');

    if (courseId) {
      const [enrollment] = await this.dataSource.query(
        'SELECT * FROM courseAdmins WHERE userId = ? AND courseId = ?',
        [user.id, courseId],
      );
      if (!enrollment) throw new ForbiddenException('User is not a course admin');
    }

    const accessToken = this.jwtService.sign({ userId: user.id, courseId, role: 'admin' });
    return { message: 'Logged in successfully', accessToken, user: this.formatUserResponse(user) };
  }

  async adminGoogleLogin(dto: GoogleAuthDto) {
    const { token: idToken, courseId } = dto;
    const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;

    const response = await fetch(googleVerifyUrl);
    const data = await response.json();
    if (!data.email_verified) throw new UnauthorizedException('Email not verified');

    const [user] = await this.dataSource.query('SELECT * FROM users WHERE email = ?', [data.email]);
    if (!user) throw new UnauthorizedException('User not found');

    if (courseId) {
      const [enrollment] = await this.dataSource.query(
        'SELECT * FROM courseAdmins WHERE userId = ? AND courseId = ?',
        [user.id, courseId],
      );
      if (!enrollment) throw new ForbiddenException('User is not a course admin');
    }

    const accessToken = this.jwtService.sign({ userId: user.id, courseId, role: 'admin' });
    return { message: 'Logged in successfully', accessToken, user: this.formatUserResponse(user) };
  }

  getImagekitAuth() {
    return this.imagekit.getAuthenticationParameters();
  }

  async logout() {
    return { message: 'Logged out successfully' };
  }
}
