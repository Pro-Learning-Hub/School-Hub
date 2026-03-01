import { Repository, DataSource } from 'typeorm';
import { Reply } from './reply.entity';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
export declare class RepliesService {
    private readonly replyRepository;
    private readonly dataSource;
    private readonly usersService;
    private readonly coursesService;
    constructor(replyRepository: Repository<Reply>, dataSource: DataSource, usersService: UsersService, coursesService: CoursesService);
    getUpvoteStatus(userId: string, replyId: string): Promise<boolean>;
    getReplies(questionId: string, userId: string, lastFetched?: string): Promise<{
        question: any;
        repliesList: any[];
        lastFetched: string;
    }>;
    createReply(questionId: string, userId: string, dto: CreateReplyDto): Promise<any>;
    voteReply(replyId: string, userId: string, action: 'upvote' | 'downvote'): Promise<{
        upvotes: any;
        upvoted: boolean;
        replyId: string;
        questionId: any;
    }>;
    updateReply(replyId: string, userId: string, dto: UpdateReplyDto): Promise<any>;
    deleteReply(replyId: string, userId: string): Promise<{
        message: string;
        replyId: string;
        questionId: any;
    }>;
    diffSync(questionId: string, userId: string, ids: string[]): Promise<{
        deleted: string[];
    }>;
}
