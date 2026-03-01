import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByGoogleId(googleId: string): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
    update(id: string, userData: Partial<User>): Promise<void>;
    getUserPublicData(userId: string): Promise<{
        id: string;
        name: string;
        pictureThumbnail: string;
    } | null>;
}
