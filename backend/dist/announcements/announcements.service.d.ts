import { Repository, DataSource } from 'typeorm';
import { Announcement } from './announcement.entity';
import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
export declare class AnnouncementsService {
    private readonly announcementRepository;
    private readonly dataSource;
    private readonly coursesService;
    private readonly usersService;
    constructor(announcementRepository: Repository<Announcement>, dataSource: DataSource, coursesService: CoursesService, usersService: UsersService);
    getAnnouncements(courseId: string, userId: string, lastFetched?: string): Promise<{
        announcements: any[];
        lastFetched: string;
    }>;
    createAnnouncement(courseId: string, userId: string, dto: CreateAnnouncementDto): Promise<any>;
    updateAnnouncement(id: string, userId: string, dto: UpdateAnnouncementDto): Promise<any>;
    deleteAnnouncement(id: string, userId: string): Promise<{
        message: string;
        courseId: any;
    }>;
    diffSync(courseId: string, userId: string, ids: string[]): Promise<{
        deleted: string[];
    }>;
}
