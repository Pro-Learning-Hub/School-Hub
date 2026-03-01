import {
  Controller, Get, Post, Put, Delete, Param, Body, Query,
  UseGuards, Res, HttpCode, HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LecturesService } from './lectures.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import axios from 'axios';

@Controller()
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @Get('lectures/media')
  async proxyMedia(
    @Query('url') url: string,
    @Query('type') type: string,
    @Res() res: Response,
  ) {
    try {
      const response = await axios.get(url, { responseType: 'stream' });
      res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
      response.data.pipe(res);
    } catch {
      res.status(500).json({ message: 'Error proxying media' });
    }
  }

  @Get('lectures/transcript')
  async proxyTranscript(
    @Query('url') url: string,
    @Query('format') format: string,
    @Res() res: Response,
  ) {
    try {
      const response = await axios.get(url, { responseType: 'stream' });
      res.setHeader('Content-Type', response.headers['content-type'] || 'text/plain');
      response.data.pipe(res);
    } catch {
      res.status(500).json({ message: 'Error proxying transcript' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('lectures/search')
  async searchLectures(
    @Query('courseId') courseId: string,
    @Query('query') query: string,
  ) {
    return this.lecturesService.searchLectures(courseId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('courses/:id/lectures')
  async getLectures(
    @Param('id') courseId: string,
    @Query('lastFetched') lastFetched: string,
    @CurrentUser() user: any,
  ) {
    return this.lecturesService.getLecturesForCourse(courseId, user.userId, lastFetched);
  }

  @UseGuards(JwtAuthGuard)
  @Get('courses/:courseId/lectures/:lectureId')
  async getLecture(
    @Param('courseId') courseId: string,
    @Param('lectureId') lectureId: string,
    @Query('updatedAt') updatedAt: string,
    @CurrentUser() user: any,
  ) {
    return this.lecturesService.getLecture(courseId, lectureId, user.userId, updatedAt);
  }

  @UseGuards(JwtAuthGuard)
  @Get('courses/:id/sections_titles')
  async getSectionsTitles(
    @Param('id') courseId: string,
    @CurrentUser() user: any,
  ) {
    return this.lecturesService.getSectionsTitles(courseId, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('courses/:id/lectures')
  @HttpCode(HttpStatus.CREATED)
  async createLecture(
    @Param('id') courseId: string,
    @Body() dto: CreateLectureDto,
    @CurrentUser() user: any,
  ) {
    return this.lecturesService.createLecture(courseId, user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('lectures/:id')
  async updateLecture(
    @Param('id') lectureId: string,
    @Body() dto: UpdateLectureDto,
    @CurrentUser() user: any,
  ) {
    return this.lecturesService.updateLecture(lectureId, user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('lectures/:id')
  async deleteLecture(
    @Param('id') lectureId: string,
    @CurrentUser() user: any,
  ) {
    return this.lecturesService.deleteLecture(lectureId, user.userId);
  }
}
