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
exports.LecturesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const lecture_entity_1 = require("./lecture.entity");
const section_entity_1 = require("./section.entity");
const lecture_resource_entity_1 = require("./lecture-resource.entity");
const courses_service_1 = require("../courses/courses.service");
function getCurrentTimeInDBFormat() {
    return new Date().toISOString().replace('T', ' ').replace('Z', '');
}
let LecturesService = class LecturesService {
    constructor(lectureRepository, sectionRepository, resourceRepository, dataSource, coursesService) {
        this.lectureRepository = lectureRepository;
        this.sectionRepository = sectionRepository;
        this.resourceRepository = resourceRepository;
        this.dataSource = dataSource;
        this.coursesService = coursesService;
    }
    async getLecturesForCourse(courseId, userId, lastFetched) {
        const course = await this.dataSource.query('SELECT id FROM courses WHERE id = ?', [courseId]);
        if (!course.length)
            throw new common_1.NotFoundException('Course not found');
        const isEnrolled = await this.coursesService.isUserEnrolledInCourse(userId, courseId);
        const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
        if (!isEnrolled && !isAdmin)
            throw new common_1.ForbiddenException('User is not enrolled in this course');
        const sections = await this.dataSource.query('SELECT id, title, description FROM sections WHERE courseId = ?', [courseId]);
        const lectureFields = 'id, title, description, tags, sectionId';
        const result = [];
        for (const section of sections) {
            const params = [section.id, ...(lastFetched ? [lastFetched] : [])];
            const sectionLectures = await this.dataSource.query(`SELECT ${lectureFields} FROM lectures WHERE sectionId = ? ${lastFetched ? 'AND createdAt > ?' : ''} ORDER BY createdAt`, params);
            const lecturesWithCourseId = sectionLectures.map((l) => ({ ...l, courseId }));
            if (lecturesWithCourseId.length > 0) {
                result.push({ ...section, lectures: lecturesWithCourseId });
            }
        }
        return { sections: result, lastFetched: getCurrentTimeInDBFormat() };
    }
    async getLecture(courseId, lectureId, userId, updatedAt) {
        const course = await this.dataSource.query('SELECT id FROM courses WHERE id = ?', [courseId]);
        if (!course.length)
            throw new common_1.NotFoundException('Course not found');
        const isEnrolled = await this.coursesService.isUserEnrolledInCourse(userId, courseId);
        const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
        if (!isEnrolled && !isAdmin)
            throw new common_1.ForbiddenException('Not authorized');
        const [lecture] = await this.dataSource.query('SELECT * FROM lectures WHERE id = ? AND courseId = ?', [lectureId, courseId]);
        if (!lecture)
            throw new common_1.NotFoundException('Lecture not found');
        if (updatedAt && lecture.updatedAt <= new Date(updatedAt)) {
            return { lectureData: null, upToDate: true };
        }
        const resources = await this.resourceRepository.find({ where: { lectureId } });
        return { lectureData: { ...lecture, resources } };
    }
    async getSectionsTitles(courseId, userId) {
        const isEnrolled = await this.coursesService.isUserEnrolledInCourse(userId, courseId);
        const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
        if (!isEnrolled && !isAdmin)
            throw new common_1.ForbiddenException('Not authorized');
        const sections = await this.dataSource.query('SELECT id, title FROM sections WHERE courseId = ? ORDER BY createdAt', [courseId]);
        return sections;
    }
    async createLecture(courseId, userId, dto) {
        const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
        if (!isAdmin)
            throw new common_1.ForbiddenException('User is not a course admin');
        const id = (0, uuid_1.v4)();
        await this.dataSource.query(`INSERT INTO lectures (id, title, description, tags, videoLink, notes, audioLink, slides, subtitles, transcript, userId, courseId, sectionId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [id, dto.title, dto.description, dto.tags || null, dto.videoLink, dto.notes, dto.audioLink || null, dto.slides || null, dto.subtitles || null, dto.transcript || null, userId, courseId, dto.sectionId]);
        if (dto.resources && dto.resources.length > 0) {
            for (const resource of dto.resources) {
                await this.dataSource.query('INSERT INTO lectureResources (id, title, url, type, lectureId) VALUES (?, ?, ?, ?, ?)', [(0, uuid_1.v4)(), resource.title, resource.url, resource.type, id]);
            }
        }
        const [lecture] = await this.dataSource.query('SELECT * FROM lectures WHERE id = ?', [id]);
        const resources = await this.resourceRepository.find({ where: { lectureId: id } });
        const [section] = await this.dataSource.query('SELECT * FROM sections WHERE id = ?', [dto.sectionId]);
        return { lecture: { ...lecture, resources }, section };
    }
    async updateLecture(lectureId, userId, dto) {
        const [lecture] = await this.dataSource.query('SELECT * FROM lectures WHERE id = ?', [lectureId]);
        if (!lecture)
            throw new common_1.NotFoundException('Lecture not found');
        const isAdmin = await this.coursesService.isCourseAdmin(userId, lecture.courseId);
        if (!isAdmin)
            throw new common_1.ForbiddenException('User is not a course admin');
        const updateFields = [];
        const updateValues = [];
        const fields = ['title', 'description', 'tags', 'videoLink', 'notes', 'audioLink', 'slides', 'subtitles', 'transcript'];
        for (const field of fields) {
            if (dto[field] !== undefined) {
                updateFields.push(`${field} = ?`);
                updateValues.push(dto[field]);
            }
        }
        if (updateFields.length > 0) {
            await this.dataSource.query(`UPDATE lectures SET ${updateFields.join(', ')} WHERE id = ?`, [...updateValues, lectureId]);
        }
        if (dto.resources !== undefined) {
            await this.dataSource.query('DELETE FROM lectureResources WHERE lectureId = ?', [lectureId]);
            for (const resource of dto.resources) {
                await this.dataSource.query('INSERT INTO lectureResources (id, title, url, type, lectureId) VALUES (?, ?, ?, ?, ?)', [resource.id || (0, uuid_1.v4)(), resource.title, resource.url, resource.type, lectureId]);
            }
        }
        const [updated] = await this.dataSource.query('SELECT * FROM lectures WHERE id = ?', [lectureId]);
        const resources = await this.resourceRepository.find({ where: { lectureId } });
        return { ...updated, resources };
    }
    async deleteLecture(lectureId, userId) {
        const [lecture] = await this.dataSource.query('SELECT * FROM lectures WHERE id = ?', [lectureId]);
        if (!lecture)
            throw new common_1.NotFoundException('Lecture not found');
        const isAdmin = await this.coursesService.isCourseAdmin(userId, lecture.courseId);
        if (!isAdmin)
            throw new common_1.ForbiddenException('User is not a course admin');
        await this.dataSource.query('DELETE FROM lectures WHERE id = ?', [lectureId]);
        return { message: 'Lecture deleted successfully', courseId: lecture.courseId, sectionId: lecture.sectionId };
    }
    async searchLectures(courseId, query) {
        const results = await this.dataSource.query(`SELECT id, title, description, tags, sectionId, courseId FROM lectures
       WHERE courseId = ? AND MATCH(title, description, tags) AGAINST(? IN BOOLEAN MODE)`, [courseId, query]);
        return { results, total: results.length, query };
    }
};
exports.LecturesService = LecturesService;
exports.LecturesService = LecturesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lecture_entity_1.Lecture)),
    __param(1, (0, typeorm_1.InjectRepository)(section_entity_1.Section)),
    __param(2, (0, typeorm_1.InjectRepository)(lecture_resource_entity_1.LectureResource)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        courses_service_1.CoursesService])
], LecturesService);
//# sourceMappingURL=lectures.service.js.map