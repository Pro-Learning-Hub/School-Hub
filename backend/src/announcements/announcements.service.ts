import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Announcement } from './announcement.entity';
import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

function getCurrentTimeInDBFormat(): string {
  return new Date().toISOString().replace('T', ' ').replace('Z', '');
}

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    private readonly dataSource: DataSource,
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
  ) {}

  async getAnnouncements(courseId: string, userId: string, lastFetched?: string) {
    const [course] = await this.dataSource.query('SELECT id FROM courses WHERE id = ?', [courseId]);
    if (!course) throw new NotFoundException('Course not found');

    const isEnrolled = await this.coursesService.isUserEnrolledInCourse(userId, courseId);
    const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
    if (!isEnrolled && !isAdmin) throw new ForbiddenException('User is not enrolled in this course');

    const params = [courseId, ...(lastFetched ? [lastFetched] : [])];
    const announcements = await this.dataSource.query(
      `SELECT * FROM announcements WHERE courseId = ? ${lastFetched ? 'AND createdAt > ?' : ''} ORDER BY createdAt DESC`,
      params,
    );

    const results: any[] = [];
    for (const announcement of announcements) {
      const user = await this.usersService.getUserPublicData(announcement.userId);
      const { userId: _, ...rest } = announcement;
      results.push({ ...rest, user });
    }

    return { announcements: results, lastFetched: getCurrentTimeInDBFormat() };
  }

  async createAnnouncement(courseId: string, userId: string, dto: CreateAnnouncementDto) {
    const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
    if (!isAdmin) throw new ForbiddenException('User is not a course admin');

    const id = uuidv4();
    await this.dataSource.query(
      'INSERT INTO announcements (id, courseId, userId, title, body) VALUES (?, ?, ?, ?, ?)',
      [id, courseId, userId, dto.title, dto.body],
    );

    const user = await this.usersService.getUserPublicData(userId);
    const [newAnnouncement] = await this.dataSource.query('SELECT * FROM announcements WHERE id = ?', [id]);
    const { userId: _, ...rest } = newAnnouncement;
    const lastFetched = getCurrentTimeInDBFormat();

    return { ...rest, lastFetched, user };
  }

  async updateAnnouncement(id: string, userId: string, dto: UpdateAnnouncementDto) {
    const [announcement] = await this.dataSource.query('SELECT courseId FROM announcements WHERE id = ?', [id]);
    if (!announcement) throw new NotFoundException('Announcement not found');

    const isAdmin = await this.coursesService.isCourseAdmin(userId, announcement.courseId);
    if (!isAdmin) throw new ForbiddenException('User is not a course admin');

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    if (dto.title !== undefined) { updateFields.push('title = ?'); updateValues.push(dto.title); }
    if (dto.body !== undefined) { updateFields.push('body = ?'); updateValues.push(dto.body); }

    if (updateFields.length > 0) {
      await this.dataSource.query(
        `UPDATE announcements SET ${updateFields.join(', ')} WHERE id = ?`,
        [...updateValues, id],
      );
    }

    const [updated] = await this.dataSource.query('SELECT * FROM announcements WHERE id = ?', [id]);
    const { userId: _, ...rest } = updated;
    return rest;
  }

  async deleteAnnouncement(id: string, userId: string) {
    const [announcement] = await this.dataSource.query('SELECT courseId FROM announcements WHERE id = ?', [id]);
    if (!announcement) throw new NotFoundException('Announcement not found');

    const isAdmin = await this.coursesService.isCourseAdmin(userId, announcement.courseId);
    if (!isAdmin) throw new ForbiddenException('User is not a course admin');

    await this.dataSource.query('DELETE FROM announcements WHERE id = ?', [id]);
    return { message: 'Announcement deleted successfully', courseId: announcement.courseId };
  }

  async diffSync(courseId: string, userId: string, ids: string[]) {
    const isEnrolled = await this.coursesService.isUserEnrolledInCourse(userId, courseId);
    const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
    if (!isEnrolled && !isAdmin) throw new ForbiddenException('Not authorized');

    const existing = await this.dataSource.query(
      'SELECT id FROM announcements WHERE courseId = ?',
      [courseId],
    );
    const existingIds = existing.map((a: any) => a.id);
    const deleted = ids.filter((id) => !existingIds.includes(id));
    return { deleted };
  }
}
