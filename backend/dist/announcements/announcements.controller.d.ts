import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
export declare class AnnouncementsController {
    private readonly announcementsService;
    constructor(announcementsService: AnnouncementsService);
    getAnnouncements(courseId: string, lastFetched: string, user: any): Promise<{
        announcements: any[];
        lastFetched: string;
    }>;
    createAnnouncement(courseId: string, dto: CreateAnnouncementDto, user: any): Promise<any>;
    updateAnnouncement(id: string, dto: UpdateAnnouncementDto, user: any): Promise<any>;
    deleteAnnouncement(id: string, user: any): Promise<{
        message: string;
        courseId: any;
    }>;
    diffSync(courseId: string, ids: string[], user: any): Promise<{
        deleted: string[];
    }>;
}
