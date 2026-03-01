import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly dataSource;
    private imagekit;
    constructor(jwtService: JwtService, dataSource: DataSource);
    private formatUserResponse;
    login(dto: LoginDto): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: any;
            email: any;
            role: any;
            firstName: any;
            lastName: any;
            pictureThumbnail: any;
            pictureUrl: any;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            username: string | undefined;
            pictureThumbnail: string | undefined;
            pictureUrl: string | undefined;
            role: string;
        };
        message: string;
    }>;
    googleLogin(dto: GoogleAuthDto): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: any;
            email: any;
            role: any;
            firstName: any;
            lastName: any;
            pictureThumbnail: any;
            pictureUrl: any;
        };
    }>;
    googleRegister(dto: GoogleAuthDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            role: string;
            firstName: any;
            lastName: any;
            pictureThumbnail: any;
            pictureUrl: any;
        };
        message: string;
    }>;
    adminLogin(dto: LoginDto): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: any;
            email: any;
            role: any;
            firstName: any;
            lastName: any;
            pictureThumbnail: any;
            pictureUrl: any;
        };
    }>;
    adminGoogleLogin(dto: GoogleAuthDto): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: any;
            email: any;
            role: any;
            firstName: any;
            lastName: any;
            pictureThumbnail: any;
            pictureUrl: any;
        };
    }>;
    getImagekitAuth(): {
        token: string;
        expire: number;
        signature: string;
    };
    logout(): Promise<{
        message: string;
    }>;
}
