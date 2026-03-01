import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Reply } from './reply.entity';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';

function getCurrentTimeInDBFormat(): string {
  return new Date().toISOString().replace('T', ' ').replace('Z', '');
}

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
    private readonly coursesService: CoursesService,
  ) {}

  async getUpvoteStatus(userId: string, replyId: string): Promise<boolean> {
    const result = await this.dataSource.query(
      'SELECT userId FROM votes WHERE userId = ? AND replyId = ?',
      [userId, replyId],
    );
    return result.length > 0;
  }

  async getReplies(questionId: string, userId: string, lastFetched?: string) {
    const [question] = await this.dataSource.query(
      `SELECT id, title, body, updatedAt, upvotes, repliesCount, userId, lectureId,
       ${lastFetched ? '(updatedAt >= ?)' : '1'} AS isNew FROM questions WHERE id = ?`,
      lastFetched ? [lastFetched, questionId] : [questionId],
    );

    if (!question) throw new NotFoundException('Question not found');

    const upvoted = await this.dataSource.query(
      'SELECT userId FROM votes WHERE userId = ? AND questionId = ?',
      [userId, questionId],
    );
    question.upvoted = upvoted.length > 0;

    let questionResponse: any;
    if (!question.isNew) {
      questionResponse = {
        id: question.id,
        repliesCount: question.repliesCount,
        upvoted: question.upvoted,
        upvotes: question.upvotes,
        updatedAt: question.updatedAt,
      };
    } else {
      question.user = await this.usersService.getUserPublicData(question.userId);
      delete question.userId;
      delete question.isNew;
      questionResponse = question;
    }

    const params = [questionId, ...(lastFetched ? [lastFetched] : [])];
    const replies = await this.dataSource.query(
      `SELECT id, body, userId, updatedAt, upvotes FROM replies
       WHERE questionId = ? ${lastFetched ? 'AND createdAt > ?' : ''} ORDER BY upvotes DESC`,
      params,
    );

    const repliesList: any[] = [];
    for (const reply of replies) {
      const user = await this.usersService.getUserPublicData(reply.userId);
      const replyUpvoted = await this.getUpvoteStatus(userId, reply.id);
      repliesList.push({ ...reply, user, upvoted: replyUpvoted });
    }

    return { question: questionResponse, repliesList, lastFetched: getCurrentTimeInDBFormat() };
  }

  async createReply(questionId: string, userId: string, dto: CreateReplyDto) {
    const [question] = await this.dataSource.query('SELECT id FROM questions WHERE id = ?', [questionId]);
    if (!question) throw new NotFoundException('Question not found');

    const id = uuidv4();
    await this.dataSource.query(
      'INSERT INTO replies (id, body, userId, questionId) VALUES (?, ?, ?, ?)',
      [id, dto.body, userId, questionId],
    );
    await this.dataSource.query(
      'UPDATE questions SET repliesCount = repliesCount + 1 WHERE id = ?',
      [questionId],
    );

    const user = await this.usersService.getUserPublicData(userId);
    const [newReply] = await this.dataSource.query('SELECT * FROM replies WHERE id = ?', [id]);
    return { ...newReply, user, upvoted: false, lastFetched: getCurrentTimeInDBFormat() };
  }

  async voteReply(replyId: string, userId: string, action: 'upvote' | 'downvote') {
    const [reply] = await this.dataSource.query('SELECT id, questionId FROM replies WHERE id = ?', [replyId]);
    if (!reply) throw new NotFoundException('Reply not found');

    if (action === 'upvote') {
      await this.dataSource.query(
        'INSERT IGNORE INTO votes (userId, replyId) VALUES (?, ?)',
        [userId, replyId],
      );
    } else {
      await this.dataSource.query(
        'DELETE FROM votes WHERE userId = ? AND replyId = ?',
        [userId, replyId],
      );
    }

    await this.dataSource.query(
      'UPDATE replies SET upvotes = (SELECT COUNT(*) FROM votes WHERE replyId = ?) WHERE id = ?',
      [replyId, replyId],
    );

    const [updated] = await this.dataSource.query('SELECT upvotes FROM replies WHERE id = ?', [replyId]);
    return { upvotes: updated.upvotes, upvoted: action === 'upvote', replyId, questionId: reply.questionId };
  }

  async updateReply(replyId: string, userId: string, dto: UpdateReplyDto) {
    const [reply] = await this.dataSource.query('SELECT * FROM replies WHERE id = ?', [replyId]);
    if (!reply) throw new NotFoundException('Reply not found');
    if (reply.userId !== userId) throw new ForbiddenException('Not authorized');

    if (dto.body !== undefined) {
      await this.dataSource.query('UPDATE replies SET body = ? WHERE id = ?', [dto.body, replyId]);
    }

    const [updated] = await this.dataSource.query('SELECT * FROM replies WHERE id = ?', [replyId]);
    return updated;
  }

  async deleteReply(replyId: string, userId: string) {
    const [reply] = await this.dataSource.query('SELECT * FROM replies WHERE id = ?', [replyId]);
    if (!reply) throw new NotFoundException('Reply not found');
    if (reply.userId !== userId) throw new ForbiddenException('Not authorized');

    await this.dataSource.query('DELETE FROM replies WHERE id = ?', [replyId]);
    await this.dataSource.query(
      'UPDATE questions SET repliesCount = GREATEST(repliesCount - 1, 0) WHERE id = ?',
      [reply.questionId],
    );
    return { message: 'Reply deleted', replyId, questionId: reply.questionId };
  }

  async diffSync(questionId: string, userId: string, ids: string[]) {
    const existing = await this.dataSource.query(
      'SELECT id FROM replies WHERE questionId = ?',
      [questionId],
    );
    const existingIds = existing.map((r: any) => r.id);
    const deleted = ids.filter((id) => !existingIds.includes(id));
    return { deleted };
  }
}
