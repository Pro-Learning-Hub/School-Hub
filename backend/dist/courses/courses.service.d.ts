import { Repository, DataSource } from 'typeorm';
import { Course } from './course.entity';
export declare class CoursesService {
    private readonly coursesRepository;
    private readonly dataSource;
    constructor(coursesRepository: Repository<Course>, dataSource: DataSource);
    findById(id: string): Promise<Course | null>;
    isCourseAdmin(userId: string, courseId: string): Promise<boolean>;
    isUserEnrolledInCourse(userId: string, courseId: string): Promise<boolean>;
}
