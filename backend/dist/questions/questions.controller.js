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
exports.QuestionsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const questions_service_1 = require("./questions.service");
const create_question_dto_1 = require("./dto/create-question.dto");
const update_question_dto_1 = require("./dto/update-question.dto");
const vote_dto_1 = require("./dto/vote.dto");
let QuestionsController = class QuestionsController {
    constructor(questionsService) {
        this.questionsService = questionsService;
    }
    async searchQuestions(courseId, lectureId, query) {
        return this.questionsService.searchQuestions(query, courseId, lectureId);
    }
    async diffSync(ids, courseId, lectureId, user) {
        return this.questionsService.diffSync(user.userId, ids, courseId, lectureId);
    }
    async getGeneralDiscussion(courseId, lastFetched, user) {
        return this.questionsService.getGeneralDiscussion(courseId, user.userId, lastFetched);
    }
    async getLectureDiscussion(lectureId, lastFetched, user) {
        return this.questionsService.getLectureDiscussion(lectureId, user.userId, lastFetched);
    }
    async createGeneralQuestion(courseId, dto, user) {
        return this.questionsService.createGeneralDiscussionQuestion(courseId, user.userId, dto);
    }
    async createLectureQuestion(lectureId, dto, user) {
        return this.questionsService.createLectureDiscussionQuestion(lectureId, user.userId, dto);
    }
    async voteQuestion(questionId, dto, user) {
        return this.questionsService.voteQuestion(questionId, user.userId, dto);
    }
    async updateQuestion(questionId, dto, user) {
        return this.questionsService.updateQuestion(questionId, user.userId, dto);
    }
    async deleteQuestion(questionId, user) {
        return this.questionsService.deleteQuestion(questionId, user.userId);
    }
};
exports.QuestionsController = QuestionsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('questions/search'),
    __param(0, (0, common_1.Query)('courseId')),
    __param(1, (0, common_1.Query)('lectureId')),
    __param(2, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "searchQuestions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('questions/diff'),
    __param(0, (0, common_1.Body)('ids')),
    __param(1, (0, common_1.Body)('courseId')),
    __param(2, (0, common_1.Body)('lectureId')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, String, Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "diffSync", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('courses/:id/general_discussion'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('lastFetched')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "getGeneralDiscussion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('lectures/:id/discussion'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('lastFetched')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "getLectureDiscussion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('courses/:id/general_discussion'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_question_dto_1.CreateQuestionDto, Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "createGeneralQuestion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('lectures/:id/discussion'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_question_dto_1.CreateQuestionDto, Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "createLectureQuestion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('questions/:id/vote'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, vote_dto_1.VoteDto, Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "voteQuestion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('questions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_question_dto_1.UpdateQuestionDto, Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "updateQuestion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('questions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "deleteQuestion", null);
exports.QuestionsController = QuestionsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [questions_service_1.QuestionsService])
], QuestionsController);
//# sourceMappingURL=questions.controller.js.map