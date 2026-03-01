import { RepliesService } from './replies.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { VoteDto } from '../questions/dto/vote.dto';
export declare class RepliesController {
    private readonly repliesService;
    constructor(repliesService: RepliesService);
    getReplies(questionId: string, lastFetched: string, user: any): Promise<{
        question: any;
        repliesList: any[];
        lastFetched: string;
    }>;
    createReply(questionId: string, dto: CreateReplyDto, user: any): Promise<any>;
    voteReply(replyId: string, dto: VoteDto, user: any): Promise<{
        upvotes: any;
        upvoted: boolean;
        replyId: string;
        questionId: any;
    }>;
    updateReply(replyId: string, dto: UpdateReplyDto, user: any): Promise<any>;
    deleteReply(replyId: string, user: any): Promise<{
        message: string;
        replyId: string;
        questionId: any;
    }>;
    diffSync(questionId: string, ids: string[], user: any): Promise<{
        deleted: string[];
    }>;
}
