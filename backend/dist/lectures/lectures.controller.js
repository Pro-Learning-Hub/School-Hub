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
exports.LecturesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const lectures_service_1 = require("./lectures.service");
const create_lecture_dto_1 = require("./dto/create-lecture.dto");
const update_lecture_dto_1 = require("./dto/update-lecture.dto");
const axios_1 = require("axios");
let LecturesController = class LecturesController {
    constructor(lecturesService) {
        this.lecturesService = lecturesService;
    }
    async proxyMedia(url, type, res) {
        try {
            const response = await axios_1.default.get(url, { responseType: 'stream' });
            res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
            response.data.pipe(res);
        }
        catch {
            res.status(500).json({ message: 'Error proxying media' });
        }
    }
    async proxyTranscript(url, format, res) {
        try {
            const response = await axios_1.default.get(url, { responseType: 'stream' });
            res.setHeader('Content-Type', response.headers['content-type'] || 'text/plain');
            response.data.pipe(res);
        }
        catch {
            res.status(500).json({ message: 'Error proxying transcript' });
        }
    }
    async searchLectures(courseId, query) {
        return this.lecturesService.searchLectures(courseId, query);
    }
    async getLectures(courseId, lastFetched, user) {
        return this.lecturesService.getLecturesForCourse(courseId, user.userId, lastFetched);
    }
    async getLecture(courseId, lectureId, updatedAt, user) {
        return this.lecturesService.getLecture(courseId, lectureId, user.userId, updatedAt);
    }
    async getSectionsTitles(courseId, user) {
        return this.lecturesService.getSectionsTitles(courseId, user.userId);
    }
    async createLecture(courseId, dto, user) {
        return this.lecturesService.createLecture(courseId, user.userId, dto);
    }
    async updateLecture(lectureId, dto, user) {
        return this.lecturesService.updateLecture(lectureId, user.userId, dto);
    }
    async deleteLecture(lectureId, user) {
        return this.lecturesService.deleteLecture(lectureId, user.userId);
    }
};
exports.LecturesController = LecturesController;
__decorate([
    (0, common_1.Get)('lectures/media'),
    __param(0, (0, common_1.Query)('url')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LecturesController.prototype, "proxyMedia", null);
__decorate([
    (0, common_1.Get)('lectures/transcript'),
    __param(0, (0, common_1.Query)('url')),
    __param(1, (0, common_1.Query)('format')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LecturesController.prototype, "proxyTranscript", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('lectures/search'),
    __param(0, (0, common_1.Query)('courseId')),
    __param(1, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LecturesController.prototype, "searchLectures", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('courses/:id/lectures'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('lastFetched')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LecturesController.prototype, "getLectures", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('courses/:courseId/lectures/:lectureId'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('lectureId')),
    __param(2, (0, common_1.Query)('updatedAt')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], LecturesController.prototype, "getLecture", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('courses/:id/sections_titles'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LecturesController.prototype, "getSectionsTitles", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('courses/:id/lectures'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_lecture_dto_1.CreateLectureDto, Object]),
    __metadata("design:returntype", Promise)
], LecturesController.prototype, "createLecture", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('lectures/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_lecture_dto_1.UpdateLectureDto, Object]),
    __metadata("design:returntype", Promise)
], LecturesController.prototype, "updateLecture", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('lectures/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LecturesController.prototype, "deleteLecture", null);
exports.LecturesController = LecturesController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [lectures_service_1.LecturesService])
], LecturesController);
//# sourceMappingURL=lectures.controller.js.map