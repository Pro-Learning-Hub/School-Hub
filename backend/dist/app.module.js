"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const lectures_module_1 = require("./lectures/lectures.module");
const announcements_module_1 = require("./announcements/announcements.module");
const questions_module_1 = require("./questions/questions.module");
const replies_module_1 = require("./replies/replies.module");
const events_module_1 = require("./gateway/events.module");
const courses_module_1 = require("./courses/courses.module");
const database_config_1 = require("./config/database.config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: database_config_1.default,
            }),
            auth_module_1.AuthModule,
            courses_module_1.CoursesModule,
            lectures_module_1.LecturesModule,
            announcements_module_1.AnnouncementsModule,
            questions_module_1.QuestionsModule,
            replies_module_1.RepliesModule,
            events_module_1.EventsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map