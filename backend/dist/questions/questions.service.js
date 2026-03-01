"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const question_entity_1 = require("./question.entity");
const vote_entity_1 = require("./vote.entity");
const courses_service_1 = require("../courses/courses.service");
const users_service_1 = require("../users/users.service");
function getCurrentTimeInDBFormat() {
    return new Date().toISOString().replace('T', ' ').replace('Z', '');
}
let QuestionsService = class QuestionsService {
    constructor(questionRepository, voteRepository, dataSource, coursesService, usersService) {
        this.questionRepository = questionRepository;
        this.voteRepository = voteRepository;
        this.dataSource = dataSource;
        this.coursesService = coursesService;
        this.usersService = usersService;
    }
    async getUpvoteStatus(userId, resourceId, resourceType) {
        const idColumn = resourceType === 'question' ? 'questionId' : 'replyId';
        const allowedColumns = ['questionId', 'replyId'];
        if (!allowedColumns.includes(idColumn))
            return false;
        const result = await this.dataSource.query(`SELECT userId FROM votes WHERE userId = ? AND ${idColumn} = ?`, [userId, resourceId]);
        return result.length > 0;
    }
    async getGeneralDiscussion(courseId, userId, lastFetched) {
        const [course] = await this.dataSource.query('SELECT id FROM courses WHERE id = ?', [courseId]);
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        const isEnrolled = await this.coursesService.isUserEnrolledInCourse(userId, courseId);
        const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
        if (!isEnrolled && !isAdmin)
            throw new common_1.ForbiddenException('Not authorized');
        const params = [courseId, ...(lastFetched ? [lastFetched] : [])];
        const entries = await this.dataSource.query(`SELECT id, title, body, updatedAt, upvotes, repliesCount, userId FROM questions
       WHERE courseId = ? ${lastFetched ? 'AND createdAt > ?' : ''} ORDER BY upvotes DESC`, params);
        const questions = [];
        for (const entry of entries) {
            const user = await this.usersService.getUserPublicData(entry.userId);
            const upvoted = await this.getUpvoteStatus(userId, entry.id, 'question');
            questions.push({ ...entry, user, upvoted });
        }
        return { questions, lastFetched: getCurrentTimeInDBFormat() };
    }
    async getLectureDiscussion(lectureId, userId, lastFetched) {
        const [lecture] = await this.dataSource.query('SELECT id, courseId FROM lectures WHERE id = ?', [lectureId]);
        if (!lecture)
            throw new common_1.NotFoundException('Lecture not found');
        const params = [lectureId, ...(lastFetched ? [lastFetched] : [])];
        const entries = await this.dataSource.query(`SELECT id, title, body, userId, upvotes, repliesCount, lectureId, updatedAt FROM questions
       WHERE lectureId = ? ${lastFetched ? 'AND createdAt > ?' : ''} ORDER BY upvotes DESC`, params);
        const results = [];
        for (const entry of entries) {
            const user = await this.usersService.getUserPublicData(entry.userId);
            const upvoted = await this.getUpvoteStatus(userId, entry.id, 'question');
            results.push({ ...entry, user, upvoted });
        }
        return { results, lastFetched: getCurrentTimeInDBFormat() };
    }
    async createGeneralDiscussionQuestion(courseId, userId, dto) {
        const isEnrolled = await this.coursesService.isUserEnrolledInCourse(userId, courseId);
        const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
        if (!isEnrolled && !isAdmin)
            throw new common_1.ForbiddenException('Not authorized');
        const id = (0, uuid_1.v4)();
        await this.dataSource.query('INSERT INTO questions (id, title, body, userId, courseId) VALUES (?, ?, ?, ?, ?)', [id, dto.title, dto.body, userId, courseId]);
        const user = await this.usersService.getUserPublicData(userId);
        const [newEntry] = await this.dataSource.query('SELECT * FROM questions WHERE id = ?', [id]);
        return { ...newEntry, user, upvoted: false, lastFetched: getCurrentTimeInDBFormat() };
    }
    async createLectureDiscussionQuestion(lectureId, userId, dto) {
        const [lecture] = await this.dataSource.query('SELECT courseId FROM lectures WHERE id = ?', [lectureId]);
        if (!lecture)
            throw new common_1.NotFoundException('Lecture not found');
        const id = (0, uuid_1.v4)();
        await this.dataSource.query('INSERT INTO questions (id, title, body, userId, lectureId) VALUES (?, ?, ?, ?, ?)', [id, dto.title, dto.body, userId, lectureId]);
        const user = await this.usersService.getUserPublicData(userId);
        const [newEntry] = await this.dataSource.query('SELECT * FROM questions WHERE id = ?', [id]);
        return { ...newEntry, user, upvoted: false, lastFetched: getCurrentTimeInDBFormat() };
    }
    async voteQuestion(questionId, userId, dto) {
        const [question] = await this.dataSource.query('SELECT * FROM questions WHERE id = ?', [questionId]);
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        if (dto.action === 'upvote') {
            await this.dataSource.query('INSERT IGNORE INTO votes (userId, questionId) VALUES (?, ?)', [userId, questionId]);
            await this.dataSource.query('UPDATE questions SET upvotes = (SELECT COUNT(*) FROM votes WHERE questionId = ?) WHERE id = ?', [questionId, questionId]);
        }
        else {
            await this.dataSource.query('DELETE FROM votes WHERE userId = ? AND questionId = ?', [userId, questionId]);
            await this.dataSource.query('UPDATE questions SET upvotes = (SELECT COUNT(*) FROM votes WHERE questionId = ?) WHERE id = ?', [questionId, questionId]);
        }
        const [updated] = await this.dataSource.query('SELECT upvotes FROM questions WHERE id = ?', [questionId]);
        const upvoted = dto.action === 'upvote';
        return { upvotes: updated.upvotes, upvoted, questionId };
    }
    async updateQuestion(questionId, userId, dto) {
        const [question] = await this.dataSource.query('SELECT * FROM questions WHERE id = ?', [questionId]);
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        if (question.userId !== userId)
            throw new common_1.ForbiddenException('Not authorized');
        const fields = [];
        const values = [];
        if (dto.title !== undefined) {
            fields.push('title = ?');
            values.push(dto.title);
        }
        if (dto.body !== undefined) {
            fields.push('body = ?');
            values.push(dto.body);
        }
        if (fields.length > 0) {
            await this.dataSource.query(`UPDATE questions SET ${fields.join(', ')} WHERE id = ?`, [...values, questionId]);
        }
        const [updated] = await this.dataSource.query('SELECT * FROM questions WHERE id = ?', [questionId]);
        return updated;
    }
    async deleteQuestion(questionId, userId) {
        const [question] = await this.dataSource.query('SELECT * FROM questions WHERE id = ?', [questionId]);
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        const isAdmin = question.courseId
            ? await this.coursesService.isCourseAdmin(userId, question.courseId)
            : false;
        if (question.userId !== userId && !isAdmin)
            throw new common_1.ForbiddenException('Not authorized');
        await this.dataSource.query('DELETE FROM questions WHERE id = ?', [questionId]);
        return { message: 'Question deleted', questionId };
    }
    async diffSync(userId, ids, courseId, lectureId) {
        let query = 'SELECT id FROM questions WHERE 1=1';
        const params = [];
        if (courseId) {
            query += ' AND courseId = ?';
            params.push(courseId);
        }
        if (lectureId) {
            query += ' AND lectureId = ?';
            params.push(lectureId);
        }
        const existing = await this.dataSource.query(query, params);
        const existingIds = existing.map((q) => q.id);
        const deleted = ids.filter((id) => !existingIds.includes(id));
        return { deleted };
    }
    async searchQuestions(query, courseId, lectureId) {
        let sql = `SELECT id, title, body, updatedAt, upvotes, repliesCount FROM questions
               WHERE MATCH(title, body) AGAINST(? IN BOOLEAN MODE)`;
        const params = [query];
        if (courseId) {
            sql += ' AND courseId = ?';
            params.push(courseId);
        }
        if (lectureId) {
            sql += ' AND lectureId = ?';
            params.push(lectureId);
        }
        const results = await this.dataSource.query(sql, params);
        return { results, total: results.length, query };
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __param(1, (0, typeorm_1.InjectRepository)(vote_entity_1.Vote)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        courses_service_1.CoursesService,
        users_service_1.UsersService])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map