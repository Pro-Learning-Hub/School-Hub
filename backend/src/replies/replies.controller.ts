import {
  Controller, Get, Post, Put, Delete, Param, Body, Query,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RepliesService } from './replies.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { VoteDto } from '../questions/dto/vote.dto';

@Controller()
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('questions/:id/replies')
  async getReplies(
    @Param('id') questionId: string,
    @Query('lastFetched') lastFetched: string,
    @CurrentUser() user: any,
  ) {
    return this.repliesService.getReplies(questionId, user.userId, lastFetched);
  }

  @UseGuards(JwtAuthGuard)
  @Post('questions/:id/replies')
  @HttpCode(HttpStatus.CREATED)
  async createReply(
    @Param('id') questionId: string,
    @Body() dto: CreateReplyDto,
    @CurrentUser() user: any,
  ) {
    return this.repliesService.createReply(questionId, user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('replies/:id/vote')
  async voteReply(
    @Param('id') replyId: string,
    @Body() dto: VoteDto,
    @CurrentUser() user: any,
  ) {
    return this.repliesService.voteReply(replyId, user.userId, dto.action);
  }

  @UseGuards(JwtAuthGuard)
  @Put('replies/:id')
  async updateReply(
    @Param('id') replyId: string,
    @Body() dto: UpdateReplyDto,
    @CurrentUser() user: any,
  ) {
    return this.repliesService.updateReply(replyId, user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('replies/:id')
  async deleteReply(
    @Param('id') replyId: string,
    @CurrentUser() user: any,
  ) {
    return this.repliesService.deleteReply(replyId, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('questions/:questionId/replies/diff')
  async diffSync(
    @Param('questionId') questionId: string,
    @Body('ids') ids: string[],
    @CurrentUser() user: any,
  ) {
    return this.repliesService.diffSync(questionId, user.userId, ids);
  }
}
