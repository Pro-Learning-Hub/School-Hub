import {
  Controller, Get, Post, Put, Delete, Param, Body, Query,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Controller()
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('courses/:id/announcements')
  async getAnnouncements(
    @Param('id') courseId: string,
    @Query('lastFetched') lastFetched: string,
    @CurrentUser() user: any,
  ) {
    return this.announcementsService.getAnnouncements(courseId, user.userId, lastFetched);
  }

  @UseGuards(JwtAuthGuard)
  @Post('courses/:id/announcements')
  @HttpCode(HttpStatus.CREATED)
  async createAnnouncement(
    @Param('id') courseId: string,
    @Body() dto: CreateAnnouncementDto,
    @CurrentUser() user: any,
  ) {
    return this.announcementsService.createAnnouncement(courseId, user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('announcements/:id')
  async updateAnnouncement(
    @Param('id') id: string,
    @Body() dto: UpdateAnnouncementDto,
    @CurrentUser() user: any,
  ) {
    return this.announcementsService.updateAnnouncement(id, user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('announcements/:id')
  async deleteAnnouncement(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.announcementsService.deleteAnnouncement(id, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('courses/:id/announcements/diff')
  async diffSync(
    @Param('id') courseId: string,
    @Body('ids') ids: string[],
    @CurrentUser() user: any,
  ) {
    return this.announcementsService.diffSync(courseId, user.userId, ids);
  }
}
