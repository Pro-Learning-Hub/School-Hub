import {
  Controller, Get, Post, Put, Delete, Param, Body, Query,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { VoteDto } from './dto/vote.dto';

@Controller()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('questions/search')
  async searchQuestions(
    @Query('courseId') courseId: string,
    @Query('lectureId') lectureId: string,
    @Query('query') query: string,
  ) {
    return this.questionsService.searchQuestions(query, courseId, lectureId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('questions/diff')
  async diffSync(
    @Body('ids') ids: string[],
    @Body('courseId') courseId: string,
    @Body('lectureId') lectureId: string,
    @CurrentUser() user: any,
  ) {
    return this.questionsService.diffSync(user.userId, ids, courseId, lectureId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('courses/:id/general_discussion')
  async getGeneralDiscussion(
    @Param('id') courseId: string,
    @Query('lastFetched') lastFetched: string,
    @CurrentUser() user: any,
  ) {
    return this.questionsService.getGeneralDiscussion(courseId, user.userId, lastFetched);
  }

  @UseGuards(JwtAuthGuard)
  @Get('lectures/:id/discussion')
  async getLectureDiscussion(
    @Param('id') lectureId: string,
    @Query('lastFetched') lastFetched: string,
    @CurrentUser() user: any,
  ) {
    return this.questionsService.getLectureDiscussion(lectureId, user.userId, lastFetched);
  }

  @UseGuards(JwtAuthGuard)
  @Post('courses/:id/general_discussion')
  @HttpCode(HttpStatus.CREATED)
  async createGeneralQuestion(
    @Param('id') courseId: string,
    @Body() dto: CreateQuestionDto,
    @CurrentUser() user: any,
  ) {
    return this.questionsService.createGeneralDiscussionQuestion(courseId, user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('lectures/:id/discussion')
  @HttpCode(HttpStatus.CREATED)
  async createLectureQuestion(
    @Param('id') lectureId: string,
    @Body() dto: CreateQuestionDto,
    @CurrentUser() user: any,
  ) {
    return this.questionsService.createLectureDiscussionQuestion(lectureId, user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('questions/:id/vote')
  async voteQuestion(
    @Param('id') questionId: string,
    @Body() dto: VoteDto,
    @CurrentUser() user: any,
  ) {
    return this.questionsService.voteQuestion(questionId, user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('questions/:id')
  async updateQuestion(
    @Param('id') questionId: string,
    @Body() dto: UpdateQuestionDto,
    @CurrentUser() user: any,
  ) {
    return this.questionsService.updateQuestion(questionId, user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('questions/:id')
  async deleteQuestion(
    @Param('id') questionId: string,
    @CurrentUser() user: any,
  ) {
    return this.questionsService.deleteQuestion(questionId, user.userId);
  }
}
