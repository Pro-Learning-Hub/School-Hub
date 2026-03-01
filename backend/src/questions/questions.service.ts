import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Question } from './question.entity';
import { Vote } from './vote.entity';
import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { VoteDto } from './dto/vote.dto';

function getCurrentTimeInDBFormat(): string {
  return new Date().toISOString().replace('T', ' ').replace('Z', '');
}

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    private readonly dataSource: DataSource,
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
  ) {}

  async getUpvoteStatus(userId: string, resourceId: string, resourceType: 'question' | 'reply'): Promise<boolean> {
    const idColumn = resourceType === 'question' ? 'questionId' : 'replyId';
    const allowedColumns = ['questionId', 'replyId'];
    if (!allowedColumns.includes(idColumn)) return false;
    const result = await this.dataSource.query(
      `SELECT userId FROM votes WHERE userId = ? AND ${idColumn} = ?`,
      [userId, resourceId],
    );
    return result.length > 0;
  }

  async getGeneralDiscussion(courseId: string, userId: string, lastFetched?: string) {
    const [course] = await this.dataSource.query('SELECT id FROM courses WHERE id = ?', [courseId]);
    if (!course) throw new NotFoundException('Course not found');

    const isEnrolled = await this.coursesService.isUserEnrolledInCourse(userId, courseId);
    const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
    if (!isEnrolled && !isAdmin) throw new ForbiddenException('Not authorized');

    const params = [courseId, ...(lastFetched ? [lastFetched] : [])];
    const entries = await this.dataSource.query(
      `SELECT id, title, body, updatedAt, upvotes, repliesCount, userId FROM questions
       WHERE courseId = ? ${lastFetched ? 'AND createdAt > ?' : ''} ORDER BY upvotes DESC`,
      params,
    );

    const questions: any[] = [];
    for (const entry of entries) {
      const user = await this.usersService.getUserPublicData(entry.userId);
      const upvoted = await this.getUpvoteStatus(userId, entry.id, 'question');
      questions.push({ ...entry, user, upvoted });
    }

    return { questions, lastFetched: getCurrentTimeInDBFormat() };
  }

  async getLectureDiscussion(lectureId: string, userId: string, lastFetched?: string) {
    const [lecture] = await this.dataSource.query('SELECT id, courseId FROM lectures WHERE id = ?', [lectureId]);
    if (!lecture) throw new NotFoundException('Lecture not found');

    const params = [lectureId, ...(lastFetched ? [lastFetched] : [])];
    const entries = await this.dataSource.query(
      `SELECT id, title, body, userId, upvotes, repliesCount, lectureId, updatedAt FROM questions
       WHERE lectureId = ? ${lastFetched ? 'AND createdAt > ?' : ''} ORDER BY upvotes DESC`,
      params,
    );

    const results: any[] = [];
    for (const entry of entries) {
      const user = await this.usersService.getUserPublicData(entry.userId);
      const upvoted = await this.getUpvoteStatus(userId, entry.id, 'question');
      results.push({ ...entry, user, upvoted });
    }

    return { results, lastFetched: getCurrentTimeInDBFormat() };
  }

  async createGeneralDiscussionQuestion(courseId: string, userId: string, dto: CreateQuestionDto) {
    const isEnrolled = await this.coursesService.isUserEnrolledInCourse(userId, courseId);
    const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
    if (!isEnrolled && !isAdmin) throw new ForbiddenException('Not authorized');

    const id = uuidv4();
    await this.dataSource.query(
      'INSERT INTO questions (id, title, body, userId, courseId) VALUES (?, ?, ?, ?, ?)',
      [id, dto.title, dto.body, userId, courseId],
    );

    const user = await this.usersService.getUserPublicData(userId);
    const [newEntry] = await this.dataSource.query('SELECT * FROM questions WHERE id = ?', [id]);
    return { ...newEntry, user, upvoted: false, lastFetched: getCurrentTimeInDBFormat() };
  }

  async createLectureDiscussionQuestion(lectureId: string, userId: string, dto: CreateQuestionDto) {
    const [lecture] = await this.dataSource.query('SELECT courseId FROM lectures WHERE id = ?', [lectureId]);
    if (!lecture) throw new NotFoundException('Lecture not found');

    const id = uuidv4();
    await this.dataSource.query(
      'INSERT INTO questions (id, title, body, userId, lectureId) VALUES (?, ?, ?, ?, ?)',
      [id, dto.title, dto.body, userId, lectureId],
    );

    const user = await this.usersService.getUserPublicData(userId);
    const [newEntry] = await this.dataSource.query('SELECT * FROM questions WHERE id = ?', [id]);
    return { ...newEntry, user, upvoted: false, lastFetched: getCurrentTimeInDBFormat() };
  }

  async voteQuestion(questionId: string, userId: string, dto: VoteDto) {
    const [question] = await this.dataSource.query('SELECT * FROM questions WHERE id = ?', [questionId]);
    if (!question) throw new NotFoundException('Question not found');

    if (dto.action === 'upvote') {
      await this.dataSource.query(
        'INSERT IGNORE INTO votes (userId, questionId) VALUES (?, ?)',
        [userId, questionId],
      );
      await this.dataSource.query(
        'UPDATE questions SET upvotes = (SELECT COUNT(*) FROM votes WHERE questionId = ?) WHERE id = ?',
        [questionId, questionId],
      );
    } else {
      await this.dataSource.query(
        'DELETE FROM votes WHERE userId = ? AND questionId = ?',
        [userId, questionId],
      );
      await this.dataSource.query(
        'UPDATE questions SET upvotes = (SELECT COUNT(*) FROM votes WHERE questionId = ?) WHERE id = ?',
        [questionId, questionId],
      );
    }

    const [updated] = await this.dataSource.query('SELECT upvotes FROM questions WHERE id = ?', [questionId]);
    const upvoted = dto.action === 'upvote';
    return { upvotes: updated.upvotes, upvoted, questionId };
  }

  async updateQuestion(questionId: string, userId: string, dto: UpdateQuestionDto) {
    const [question] = await this.dataSource.query('SELECT * FROM questions WHERE id = ?', [questionId]);
    if (!question) throw new NotFoundException('Question not found');
    if (question.userId !== userId) throw new ForbiddenException('Not authorized');

    const fields: string[] = [];
    const values: any[] = [];
    if (dto.title !== undefined) { fields.push('title = ?'); values.push(dto.title); }
    if (dto.body !== undefined) { fields.push('body = ?'); values.push(dto.body); }

    if (fields.length > 0) {
      await this.dataSource.query(`UPDATE questions SET ${fields.join(', ')} WHERE id = ?`, [...values, questionId]);
    }

    const [updated] = await this.dataSource.query('SELECT * FROM questions WHERE id = ?', [questionId]);
    return updated;
  }

  async deleteQuestion(questionId: string, userId: string) {
    const [question] = await this.dataSource.query('SELECT * FROM questions WHERE id = ?', [questionId]);
    if (!question) throw new NotFoundException('Question not found');

    const isAdmin = question.courseId
      ? await this.coursesService.isCourseAdmin(userId, question.courseId)
      : false;
    if (question.userId !== userId && !isAdmin) throw new ForbiddenException('Not authorized');

    await this.dataSource.query('DELETE FROM questions WHERE id = ?', [questionId]);
    return { message: 'Question deleted', questionId };
  }

  async diffSync(userId: string, ids: string[], courseId?: string, lectureId?: string) {
    let query = 'SELECT id FROM questions WHERE 1=1';
    const params: any[] = [];
    if (courseId) { query += ' AND courseId = ?'; params.push(courseId); }
    if (lectureId) { query += ' AND lectureId = ?'; params.push(lectureId); }

    const existing = await this.dataSource.query(query, params);
    const existingIds = existing.map((q: any) => q.id);
    const deleted = ids.filter((id) => !existingIds.includes(id));
    return { deleted };
  }

  async searchQuestions(query: string, courseId?: string, lectureId?: string) {
    let sql = `SELECT id, title, body, updatedAt, upvotes, repliesCount FROM questions
               WHERE MATCH(title, body) AGAINST(? IN BOOLEAN MODE)`;
    const params: any[] = [query];
    if (courseId) { sql += ' AND courseId = ?'; params.push(courseId); }
    if (lectureId) { sql += ' AND lectureId = ?'; params.push(lectureId); }

    const results = await this.dataSource.query(sql, params);
    return { results, total: results.length, query };
  }
}
