import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
            id: string;
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
    logout(): Promise<{
        message: string;
    }>;
    getImagekitAuth(): {
        token: string;
        expire: number;
        signature: string;
    };
}
