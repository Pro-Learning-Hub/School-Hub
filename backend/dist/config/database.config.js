"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_entity_1 = require("../users/user.entity");
const course_entity_1 = require("../courses/course.entity");
const section_entity_1 = require("../lectures/section.entity");
const lecture_entity_1 = require("../lectures/lecture.entity");
const lecture_resource_entity_1 = require("../lectures/lecture-resource.entity");
const announcement_entity_1 = require("../announcements/announcement.entity");
const question_entity_1 = require("../questions/question.entity");
const vote_entity_1 = require("../questions/vote.entity");
const reply_entity_1 = require("../replies/reply.entity");
exports.default = () => ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pro_learning_hub',
    entities: [user_entity_1.User, course_entity_1.Course, section_entity_1.Section, lecture_entity_1.Lecture, lecture_resource_entity_1.LectureResource, announcement_entity_1.Announcement, question_entity_1.Question, vote_entity_1.Vote, reply_entity_1.Reply],
    synchronize: false,
    timezone: 'Z',
});
//# sourceMappingURL=database.config.js.map