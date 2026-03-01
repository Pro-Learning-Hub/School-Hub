import { Repository, DataSource } from 'typeorm';
import { Lecture } from './lecture.entity';
import { Section } from './section.entity';
import { LectureResource } from './lecture-resource.entity';
import { CoursesService } from '../courses/courses.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
export declare class LecturesService {
    private readonly lectureRepository;
    private readonly sectionRepository;
    private readonly resourceRepository;
    private readonly dataSource;
    private readonly coursesService;
    constructor(lectureRepository: Repository<Lecture>, sectionRepository: Repository<Section>, resourceRepository: Repository<LectureResource>, dataSource: DataSource, coursesService: CoursesService);
    getLecturesForCourse(courseId: string, userId: string, lastFetched?: string): Promise<{
        sections: any[];
        lastFetched: string;
    }>;
    getLecture(courseId: string, lectureId: string, userId: string, updatedAt?: string): Promise<{
        lectureData: null;
        upToDate: boolean;
    } | {
        lectureData: any;
        upToDate?: undefined;
    }>;
    getSectionsTitles(courseId: string, userId: string): Promise<any>;
    createLecture(courseId: string, userId: string, dto: CreateLectureDto): Promise<{
        lecture: any;
        section: any;
    }>;
    updateLecture(lectureId: string, userId: string, dto: UpdateLectureDto): Promise<any>;
    deleteLecture(lectureId: string, userId: string): Promise<{
        message: string;
        courseId: any;
        sectionId: any;
    }>;
    searchLectures(courseId: string, query: string): Promise<{
        results: any;
        total: any;
        query: string;
    }>;
}
