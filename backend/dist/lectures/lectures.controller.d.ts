import { Response } from 'express';
import { LecturesService } from './lectures.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
export declare class LecturesController {
    private readonly lecturesService;
    constructor(lecturesService: LecturesService);
    proxyMedia(url: string, type: string, res: Response): Promise<void>;
    proxyTranscript(url: string, format: string, res: Response): Promise<void>;
    searchLectures(courseId: string, query: string): Promise<{
        results: any;
        total: any;
        query: string;
    }>;
    getLectures(courseId: string, lastFetched: string, user: any): Promise<{
        sections: any[];
        lastFetched: string;
    }>;
    getLecture(courseId: string, lectureId: string, updatedAt: string, user: any): Promise<{
        lectureData: null;
        upToDate: boolean;
    } | {
        lectureData: any;
        upToDate?: undefined;
    }>;
    getSectionsTitles(courseId: string, user: any): Promise<any>;
    createLecture(courseId: string, dto: CreateLectureDto, user: any): Promise<{
        lecture: any;
        section: any;
    }>;
    updateLecture(lectureId: string, dto: UpdateLectureDto, user: any): Promise<any>;
    deleteLecture(lectureId: string, user: any): Promise<{
        message: string;
        courseId: any;
        sectionId: any;
    }>;
}
