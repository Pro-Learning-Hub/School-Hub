import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LecturesController } from './lectures.controller';
import { LecturesService } from './lectures.service';
import { Lecture } from './lecture.entity';
import { Section } from './section.entity';
import { LectureResource } from './lecture-resource.entity';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lecture, Section, LectureResource]),
    CoursesModule,
  ],
  controllers: [LecturesController],
  providers: [LecturesService],
  exports: [LecturesService],
})
export class LecturesModule {}
