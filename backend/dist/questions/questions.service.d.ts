import { Repository, DataSource } from 'typeorm';
import { Question } from './question.entity';
import { Vote } from './vote.entity';
import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { VoteDto } from './dto/vote.dto';
export declare class QuestionsService {
    private readonly questionRepository;
    private readonly voteRepository;
    private readonly dataSource;
    private readonly coursesService;
    private readonly usersService;
    constructor(questionRepository: Repository<Question>, voteRepository: Repository<Vote>, dataSource: DataSource, coursesService: CoursesService, usersService: UsersService);
    getUpvoteStatus(userId: string, resourceId: string, resourceType: 'question' | 'reply'): Promise<boolean>;
    getGeneralDiscussion(courseId: string, userId: string, lastFetched?: string): Promise<{
        questions: any[];
        lastFetched: string;
    }>;
    getLectureDiscussion(lectureId: string, userId: string, lastFetched?: string): Promise<{
        results: any[];
        lastFetched: string;
    }>;
    createGeneralDiscussionQuestion(courseId: string, userId: string, dto: CreateQuestionDto): Promise<any>;
    createLectureDiscussionQuestion(lectureId: string, userId: string, dto: CreateQuestionDto): Promise<any>;
    voteQuestion(questionId: string, userId: string, dto: VoteDto): Promise<{
        upvotes: any;
        upvoted: boolean;
        questionId: string;
    }>;
    updateQuestion(questionId: string, userId: string, dto: UpdateQuestionDto): Promise<any>;
    deleteQuestion(questionId: string, userId: string): Promise<{
        message: string;
        questionId: string;
    }>;
    diffSync(userId: string, ids: string[], courseId?: string, lectureId?: string): Promise<{
        deleted: string[];
    }>;
    searchQuestions(query: string, courseId?: string, lectureId?: string): Promise<{
        results: any;
        total: any;
        query: string;
    }>;
}
