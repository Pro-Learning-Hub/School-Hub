"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcryptjs");
const uuid_1 = require("uuid");
const imagekit_1 = require("imagekit");
let AuthService = class AuthService {
    constructor(jwtService, dataSource) {
        this.jwtService = jwtService;
        this.dataSource = dataSource;
        this.imagekit = new imagekit_1.default({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
            urlEndpoint: process.env.IMAGEKIT_ENDPOINT || '',
        });
    }
    formatUserResponse(user) {
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
    async login(dto) {
        const { email, password, courseId } = dto;
        const [user] = await this.dataSource.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!user)
            throw new common_1.UnauthorizedException('Email not found');
        if (!user.passwordHash && user.googleId) {
            throw new common_1.UnauthorizedException('Account registered with Google. Please use Google login');
        }
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException(user.googleId ? 'Wrong password. You can still use Google login.' : 'Wrong password');
        }
        if (courseId) {
            const [enrollment] = await this.dataSource.query('SELECT * FROM courseEnrollments WHERE userId = ? AND courseId = ?', [user.id, courseId]);
            if (!enrollment)
                throw new common_1.ForbiddenException('User is not enrolled in the course');
        }
        const accessToken = this.jwtService.sign({ userId: user.id, courseId, role: user.role });
        return { message: 'Logged in successfully', accessToken, user: this.formatUserResponse(user) };
    }
    async register(dto) {
        const { userData, courseId } = dto;
        const { email, password, firstName, lastName, username, pictureId, pictureURL, pictureThumbnail } = userData;
        const [existingUser] = await this.dataSource.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser)
            throw new common_1.ConflictException('Email already exists');
        const id = (0, uuid_1.v4)();
        const passwordHash = await bcrypt.hash(password, 12);
        await this.dataSource.query('INSERT INTO users (id, email, passwordHash, firstName, lastName, username, pictureId, pictureUrl, pictureThumbnail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, email, passwordHash, firstName, lastName, username || null, pictureId || null, pictureURL || null, pictureThumbnail || null]);
        if (courseId) {
            await this.dataSource.query('INSERT INTO courseEnrollments (userId, courseId) VALUES (?, ?)', [id, courseId]);
        }
        const accessToken = this.jwtService.sign({ userId: id, courseId, role: 'student' });
        return {
            accessToken,
            user: { id, email, firstName, lastName, username, pictureThumbnail, pictureUrl: pictureURL, role: 'student' },
            message: 'User created successfully',
        };
    }
    async googleLogin(dto) {
        const { token: idToken, courseId } = dto;
        const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
        const response = await fetch(googleVerifyUrl);
        const data = await response.json();
        if (!data.email_verified)
            throw new common_1.UnauthorizedException('Email not verified');
        const [user] = await this.dataSource.query('SELECT * FROM users WHERE email = ?', [data.email]);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        if (!user.googleId) {
            await this.dataSource.query('UPDATE users SET googleId = ? WHERE email = ?', [data.sub, data.email]);
        }
        if (courseId) {
            const [enrollment] = await this.dataSource.query('SELECT 1 FROM courseEnrollments WHERE userId = ? AND courseId = ?', [user.id, courseId]);
            if (!enrollment)
                throw new common_1.ForbiddenException('User is not enrolled in this course');
        }
        const accessToken = this.jwtService.sign({ userId: user.id, courseId, role: user.role });
        return { message: 'Logged in successfully', accessToken, user: this.formatUserResponse(user) };
    }
    async googleRegister(dto) {
        const { token: idToken, courseId } = dto;
        const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
        const response = await fetch(googleVerifyUrl);
        const userData = await response.json();
        if (!response.ok)
            throw new common_1.UnauthorizedException('Error connecting to Google');
        if (userData.error)
            throw new common_1.UnauthorizedException(`${userData.error}: ${userData.error_description}`);
        if (!userData.email_verified)
            throw new common_1.UnauthorizedException('Email not verified');
        const [existingUser] = await this.dataSource.query('SELECT id FROM users WHERE email = ?', [userData.email]);
        if (existingUser)
            throw new common_1.ConflictException('Email already exists');
        const userId = userData.sub;
        await this.dataSource.query('INSERT INTO users (id, googleId, email, firstName, lastName, pictureUrl, pictureThumbnail) VALUES (?, ?, ?, ?, ?, ?, ?)', [userId, userId, userData.email, userData.given_name, userData.family_name, userData.picture, userData.picture]);
        if (courseId) {
            await this.dataSource.query('INSERT INTO courseEnrollments (userId, courseId) VALUES (?, ?)', [userId, courseId]);
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
    async adminLogin(dto) {
        const { email, password, courseId } = dto;
        const [user] = await this.dataSource.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, 'admin']);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch)
            throw new common_1.UnauthorizedException('Wrong password');
        if (courseId) {
            const [enrollment] = await this.dataSource.query('SELECT * FROM courseAdmins WHERE userId = ? AND courseId = ?', [user.id, courseId]);
            if (!enrollment)
                throw new common_1.ForbiddenException('User is not a course admin');
        }
        const accessToken = this.jwtService.sign({ userId: user.id, courseId, role: 'admin' });
        return { message: 'Logged in successfully', accessToken, user: this.formatUserResponse(user) };
    }
    async adminGoogleLogin(dto) {
        const { token: idToken, courseId } = dto;
        const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
        const response = await fetch(googleVerifyUrl);
        const data = await response.json();
        if (!data.email_verified)
            throw new common_1.UnauthorizedException('Email not verified');
        const [user] = await this.dataSource.query('SELECT * FROM users WHERE email = ?', [data.email]);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        if (courseId) {
            const [enrollment] = await this.dataSource.query('SELECT * FROM courseAdmins WHERE userId = ? AND courseId = ?', [user.id, courseId]);
            if (!enrollment)
                throw new common_1.ForbiddenException('User is not a course admin');
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_1.DataSource])
], AuthService);
//# sourceMappingURL=auth.service.js.map