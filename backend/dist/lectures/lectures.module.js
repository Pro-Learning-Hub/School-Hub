"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LecturesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const lectures_controller_1 = require("./lectures.controller");
const lectures_service_1 = require("./lectures.service");
const lecture_entity_1 = require("./lecture.entity");
const section_entity_1 = require("./section.entity");
const lecture_resource_entity_1 = require("./lecture-resource.entity");
const courses_module_1 = require("../courses/courses.module");
let LecturesModule = class LecturesModule {
};
exports.LecturesModule = LecturesModule;
exports.LecturesModule = LecturesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([lecture_entity_1.Lecture, section_entity_1.Section, lecture_resource_entity_1.LectureResource]),
            courses_module_1.CoursesModule,
        ],
        controllers: [lectures_controller_1.LecturesController],
        providers: [lectures_service_1.LecturesService],
        exports: [lectures_service_1.LecturesService],
    })
], LecturesModule);
//# sourceMappingURL=lectures.module.js.map