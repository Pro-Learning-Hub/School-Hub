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
exports.AnnouncementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const announcement_entity_1 = require("./announcement.entity");
const courses_service_1 = require("../courses/courses.service");
const users_service_1 = require("../users/users.service");
function getCurrentTimeInDBFormat() {
    return new Date().toISOString().replace('T', ' ').replace('Z', '');
}
let AnnouncementsService = class AnnouncementsService {
    constructor(announcementRepository, dataSource, coursesService, usersService) {
        this.announcementRepository = announcementRepository;
        this.dataSource = dataSource;
        this.coursesService = coursesService;
        this.usersService = usersService;
    }
    async getAnnouncements(courseId, userId, lastFetched) {
        const [course] = await this.dataSource.query('SELECT id FROM courses WHERE id = ?', [courseId]);
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        const isEnrolled = await this.coursesService.isUserEnrolledInCourse(userId, courseId);
        const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
        if (!isEnrolled && !isAdmin)
            throw new common_1.ForbiddenException('User is not enrolled in this course');
        const params = [courseId, ...(lastFetched ? [lastFetched] : [])];
        const announcements = await this.dataSource.query(`SELECT * FROM announcements WHERE courseId = ? ${lastFetched ? 'AND createdAt > ?' : ''} ORDER BY createdAt DESC`, params);
        const results = [];
        for (const announcement of announcements) {
            const user = await this.usersService.getUserPublicData(announcement.userId);
            const { userId: _, ...rest } = announcement;
            results.push({ ...rest, user });
        }
        return { announcements: results, lastFetched: getCurrentTimeInDBFormat() };
    }
    async createAnnouncement(courseId, userId, dto) {
        const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
        if (!isAdmin)
            throw new common_1.ForbiddenException('User is not a course admin');
        const id = (0, uuid_1.v4)();
        await this.dataSource.query('INSERT INTO announcements (id, courseId, userId, title, body) VALUES (?, ?, ?, ?, ?)', [id, courseId, userId, dto.title, dto.details]);
        const user = await this.usersService.getUserPublicData(userId);
        const [newAnnouncement] = await this.dataSource.query('SELECT * FROM announcements WHERE id = ?', [id]);
        const { userId: _, ...rest } = newAnnouncement;
        const lastFetched = getCurrentTimeInDBFormat();
        return { ...rest, lastFetched, user };
    }
    async updateAnnouncement(id, userId, dto) {
        const [announcement] = await this.dataSource.query('SELECT courseId FROM announcements WHERE id = ?', [id]);
        if (!announcement)
            throw new common_1.NotFoundException('Announcement not found');
        const isAdmin = await this.coursesService.isCourseAdmin(userId, announcement.courseId);
        if (!isAdmin)
            throw new common_1.ForbiddenException('User is not a course admin');
        const updateFields = [];
        const updateValues = [];
        if (dto.title !== undefined) {
            updateFields.push('title = ?');
            updateValues.push(dto.title);
        }
        if (dto.details !== undefined) {
            updateFields.push('body = ?');
            updateValues.push(dto.details);
        }
        if (updateFields.length > 0) {
            await this.dataSource.query(`UPDATE announcements SET ${updateFields.join(', ')} WHERE id = ?`, [...updateValues, id]);
        }
        const [updated] = await this.dataSource.query('SELECT * FROM announcements WHERE id = ?', [id]);
        const { userId: _, ...rest } = updated;
        return rest;
    }
    async deleteAnnouncement(id, userId) {
        const [announcement] = await this.dataSource.query('SELECT courseId FROM announcements WHERE id = ?', [id]);
        if (!announcement)
            throw new common_1.NotFoundException('Announcement not found');
        const isAdmin = await this.coursesService.isCourseAdmin(userId, announcement.courseId);
        if (!isAdmin)
            throw new common_1.ForbiddenException('User is not a course admin');
        await this.dataSource.query('DELETE FROM announcements WHERE id = ?', [id]);
        return { message: 'Announcement deleted successfully', courseId: announcement.courseId };
    }
    async diffSync(courseId, userId, ids) {
        const isEnrolled = await this.coursesService.isUserEnrolledInCourse(userId, courseId);
        const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
        if (!isEnrolled && !isAdmin)
            throw new common_1.ForbiddenException('Not authorized');
        const existing = await this.dataSource.query('SELECT id FROM announcements WHERE courseId = ?', [courseId]);
        const existingIds = existing.map((a) => a.id);
        const deleted = ids.filter((id) => !existingIds.includes(id));
        return { deleted };
    }
};
exports.AnnouncementsService = AnnouncementsService;
exports.AnnouncementsService = AnnouncementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(announcement_entity_1.Announcement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        courses_service_1.CoursesService,
        users_service_1.UsersService])
], AnnouncementsService);
//# sourceMappingURL=announcements.service.js.map