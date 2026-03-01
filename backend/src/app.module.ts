import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LecturesModule } from './lectures/lectures.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { QuestionsModule } from './questions/questions.module';
import { RepliesModule } from './replies/replies.module';
import { EventsModule } from './gateway/events.module';
import { CoursesModule } from './courses/courses.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    AuthModule,
    CoursesModule,
    LecturesModule,
    AnnouncementsModule,
    QuestionsModule,
    RepliesModule,
    EventsModule,
  ],
})
export class AppModule {}
