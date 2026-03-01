import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { VoteDto } from './dto/vote.dto';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    searchQuestions(courseId: string, lectureId: string, query: string): Promise<{
        results: any;
        total: any;
        query: string;
    }>;
    diffSync(ids: string[], courseId: string, lectureId: string, user: any): Promise<{
        deleted: string[];
    }>;
    getGeneralDiscussion(courseId: string, lastFetched: string, user: any): Promise<{
        questions: any[];
        lastFetched: string;
    }>;
    getLectureDiscussion(lectureId: string, lastFetched: string, user: any): Promise<{
        results: any[];
        lastFetched: string;
    }>;
    createGeneralQuestion(courseId: string, dto: CreateQuestionDto, user: any): Promise<any>;
    createLectureQuestion(lectureId: string, dto: CreateQuestionDto, user: any): Promise<any>;
    voteQuestion(questionId: string, dto: VoteDto, user: any): Promise<{
        upvotes: any;
        upvoted: boolean;
        questionId: string;
    }>;
    updateQuestion(questionId: string, dto: UpdateQuestionDto, user: any): Promise<any>;
    deleteQuestion(questionId: string, user: any): Promise<{
        message: string;
        questionId: string;
    }>;
}
