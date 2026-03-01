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
exports.RepliesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const replies_service_1 = require("./replies.service");
const create_reply_dto_1 = require("./dto/create-reply.dto");
const update_reply_dto_1 = require("./dto/update-reply.dto");
const vote_dto_1 = require("../questions/dto/vote.dto");
let RepliesController = class RepliesController {
    constructor(repliesService) {
        this.repliesService = repliesService;
    }
    async getReplies(questionId, lastFetched, user) {
        return this.repliesService.getReplies(questionId, user.userId, lastFetched);
    }
    async createReply(questionId, dto, user) {
        return this.repliesService.createReply(questionId, user.userId, dto);
    }
    async voteReply(replyId, dto, user) {
        return this.repliesService.voteReply(replyId, user.userId, dto.action);
    }
    async updateReply(replyId, dto, user) {
        return this.repliesService.updateReply(replyId, user.userId, dto);
    }
    async deleteReply(replyId, user) {
        return this.repliesService.deleteReply(replyId, user.userId);
    }
    async diffSync(questionId, ids, user) {
        return this.repliesService.diffSync(questionId, user.userId, ids);
    }
};
exports.RepliesController = RepliesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('questions/:id/replies'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('lastFetched')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], RepliesController.prototype, "getReplies", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('questions/:id/replies'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_reply_dto_1.CreateReplyDto, Object]),
    __metadata("design:returntype", Promise)
], RepliesController.prototype, "createReply", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('replies/:id/vote'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, vote_dto_1.VoteDto, Object]),
    __metadata("design:returntype", Promise)
], RepliesController.prototype, "voteReply", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('replies/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reply_dto_1.UpdateReplyDto, Object]),
    __metadata("design:returntype", Promise)
], RepliesController.prototype, "updateReply", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('replies/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RepliesController.prototype, "deleteReply", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('questions/:questionId/replies/diff'),
    __param(0, (0, common_1.Param)('questionId')),
    __param(1, (0, common_1.Body)('ids')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], RepliesController.prototype, "diffSync", null);
exports.RepliesController = RepliesController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [replies_service_1.RepliesService])
], RepliesController);
//# sourceMappingURL=replies.controller.js.map