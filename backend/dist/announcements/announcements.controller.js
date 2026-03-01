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
exports.AnnouncementsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const announcements_service_1 = require("./announcements.service");
const create_announcement_dto_1 = require("./dto/create-announcement.dto");
const update_announcement_dto_1 = require("./dto/update-announcement.dto");
let AnnouncementsController = class AnnouncementsController {
    constructor(announcementsService) {
        this.announcementsService = announcementsService;
    }
    async getAnnouncements(courseId, lastFetched, user) {
        return this.announcementsService.getAnnouncements(courseId, user.userId, lastFetched);
    }
    async createAnnouncement(courseId, dto, user) {
        return this.announcementsService.createAnnouncement(courseId, user.userId, dto);
    }
    async updateAnnouncement(id, dto, user) {
        return this.announcementsService.updateAnnouncement(id, user.userId, dto);
    }
    async deleteAnnouncement(id, user) {
        return this.announcementsService.deleteAnnouncement(id, user.userId);
    }
    async diffSync(courseId, ids, user) {
        return this.announcementsService.diffSync(courseId, user.userId, ids);
    }
};
exports.AnnouncementsController = AnnouncementsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('courses/:id/announcements'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('lastFetched')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementsController.prototype, "getAnnouncements", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('courses/:id/announcements'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_announcement_dto_1.CreateAnnouncementDto, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementsController.prototype, "createAnnouncement", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('announcements/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_announcement_dto_1.UpdateAnnouncementDto, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementsController.prototype, "updateAnnouncement", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('announcements/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementsController.prototype, "deleteAnnouncement", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('courses/:id/announcements/diff'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('ids')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementsController.prototype, "diffSync", null);
exports.AnnouncementsController = AnnouncementsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [announcements_service_1.AnnouncementsService])
], AnnouncementsController);
//# sourceMappingURL=announcements.controller.js.map