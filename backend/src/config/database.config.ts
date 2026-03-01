import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { Section } from '../lectures/section.entity';
import { Lecture } from '../lectures/lecture.entity';
import { LectureResource } from '../lectures/lecture-resource.entity';
import { Announcement } from '../announcements/announcement.entity';
import { Question } from '../questions/question.entity';
import { Vote } from '../questions/vote.entity';
import { Reply } from '../replies/reply.entity';

export default (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pro_learning_hub',
  entities: [User, Course, Section, Lecture, LectureResource, Announcement, Question, Vote, Reply],
  synchronize: false,
  timezone: 'Z',
});
