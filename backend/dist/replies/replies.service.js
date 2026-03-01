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
exports.RepliesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const reply_entity_1 = require("./reply.entity");
const users_service_1 = require("../users/users.service");
const courses_service_1 = require("../courses/courses.service");
function getCurrentTimeInDBFormat() {
    return new Date().toISOString().replace('T', ' ').replace('Z', '');
}
let RepliesService = class RepliesService {
    constructor(replyRepository, dataSource, usersService, coursesService) {
        this.replyRepository = replyRepository;
        this.dataSource = dataSource;
        this.usersService = usersService;
        this.coursesService = coursesService;
    }
    async getUpvoteStatus(userId, replyId) {
        const result = await this.dataSource.query('SELECT userId FROM votes WHERE userId = ? AND replyId = ?', [userId, replyId]);
        return result.length > 0;
    }
    async getReplies(questionId, userId, lastFetched) {
        const [question] = await this.dataSource.query(`SELECT id, title, body, updatedAt, upvotes, repliesCount, userId, lectureId,
       ${lastFetched ? '(updatedAt >= ?)' : '1'} AS isNew FROM questions WHERE id = ?`, lastFetched ? [lastFetched, questionId] : [questionId]);
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        const upvoted = await this.dataSource.query('SELECT userId FROM votes WHERE userId = ? AND questionId = ?', [userId, questionId]);
        question.upvoted = upvoted.length > 0;
        let questionResponse;
        if (!question.isNew) {
            questionResponse = {
                id: question.id,
                repliesCount: question.repliesCount,
                upvoted: question.upvoted,
                upvotes: question.upvotes,
                updatedAt: question.updatedAt,
            };
        }
        else {
            question.user = await this.usersService.getUserPublicData(question.userId);
            delete question.userId;
            delete question.isNew;
            questionResponse = question;
        }
        const params = [questionId, ...(lastFetched ? [lastFetched] : [])];
        const replies = await this.dataSource.query(`SELECT id, body, userId, updatedAt, upvotes FROM replies
       WHERE questionId = ? ${lastFetched ? 'AND createdAt > ?' : ''} ORDER BY upvotes DESC`, params);
        const repliesList = [];
        for (const reply of replies) {
            const user = await this.usersService.getUserPublicData(reply.userId);
            const replyUpvoted = await this.getUpvoteStatus(userId, reply.id);
            repliesList.push({ ...reply, user, upvoted: replyUpvoted });
        }
        return { question: questionResponse, repliesList, lastFetched: getCurrentTimeInDBFormat() };
    }
    async createReply(questionId, userId, dto) {
        const [question] = await this.dataSource.query('SELECT id FROM questions WHERE id = ?', [questionId]);
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        const id = (0, uuid_1.v4)();
        await this.dataSource.query('INSERT INTO replies (id, body, userId, questionId) VALUES (?, ?, ?, ?)', [id, dto.body, userId, questionId]);
        await this.dataSource.query('UPDATE questions SET repliesCount = repliesCount + 1 WHERE id = ?', [questionId]);
        const user = await this.usersService.getUserPublicData(userId);
        const [newReply] = await this.dataSource.query('SELECT * FROM replies WHERE id = ?', [id]);
        return { ...newReply, user, upvoted: false, lastFetched: getCurrentTimeInDBFormat() };
    }
    async voteReply(replyId, userId, action) {
        const [reply] = await this.dataSource.query('SELECT id, questionId FROM replies WHERE id = ?', [replyId]);
        if (!reply)
            throw new common_1.NotFoundException('Reply not found');
        if (action === 'upvote') {
            await this.dataSource.query('INSERT IGNORE INTO votes (userId, replyId) VALUES (?, ?)', [userId, replyId]);
        }
        else {
            await this.dataSource.query('DELETE FROM votes WHERE userId = ? AND replyId = ?', [userId, replyId]);
        }
        await this.dataSource.query('UPDATE replies SET upvotes = (SELECT COUNT(*) FROM votes WHERE replyId = ?) WHERE id = ?', [replyId, replyId]);
        const [updated] = await this.dataSource.query('SELECT upvotes FROM replies WHERE id = ?', [replyId]);
        return { upvotes: updated.upvotes, upvoted: action === 'upvote', replyId, questionId: reply.questionId };
    }
    async updateReply(replyId, userId, dto) {
        const [reply] = await this.dataSource.query('SELECT * FROM replies WHERE id = ?', [replyId]);
        if (!reply)
            throw new common_1.NotFoundException('Reply not found');
        if (reply.userId !== userId)
            throw new common_1.ForbiddenException('Not authorized');
        if (dto.body !== undefined) {
            await this.dataSource.query('UPDATE replies SET body = ? WHERE id = ?', [dto.body, replyId]);
        }
        const [updated] = await this.dataSource.query('SELECT * FROM replies WHERE id = ?', [replyId]);
        return updated;
    }
    async deleteReply(replyId, userId) {
        const [reply] = await this.dataSource.query('SELECT * FROM replies WHERE id = ?', [replyId]);
        if (!reply)
            throw new common_1.NotFoundException('Reply not found');
        if (reply.userId !== userId)
            throw new common_1.ForbiddenException('Not authorized');
        await this.dataSource.query('DELETE FROM replies WHERE id = ?', [replyId]);
        await this.dataSource.query('UPDATE questions SET repliesCount = GREATEST(repliesCount - 1, 0) WHERE id = ?', [reply.questionId]);
        return { message: 'Reply deleted', replyId, questionId: reply.questionId };
    }
    async diffSync(questionId, userId, ids) {
        const existing = await this.dataSource.query('SELECT id FROM replies WHERE questionId = ?', [questionId]);
        const existingIds = existing.map((r) => r.id);
        const deleted = ids.filter((id) => !existingIds.includes(id));
        return { deleted };
    }
};
exports.RepliesService = RepliesService;
exports.RepliesService = RepliesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reply_entity_1.Reply)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        users_service_1.UsersService,
        courses_service_1.CoursesService])
], RepliesService);
//# sourceMappingURL=replies.service.js.map