declare class UserDataDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username?: string;
    pictureId?: string;
    pictureURL?: string;
    pictureThumbnail?: string;
}
export declare class RegisterDto {
    userData: UserDataDto;
    courseId?: string;
}
export {};
