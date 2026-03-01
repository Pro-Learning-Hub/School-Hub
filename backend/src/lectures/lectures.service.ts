import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Lecture } from './lecture.entity';
import { Section } from './section.entity';
import { LectureResource } from './lecture-resource.entity';
import { CoursesService } from '../courses/courses.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';

function getCurrentTimeInDBFormat(): string {
  return new Date().toISOString().replace('T', ' ').replace('Z', '');
}

@Injectable()
export class LecturesService {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(LectureResource)
    private readonly resourceRepository: Repository<LectureResource>,
    private readonly dataSource: DataSource,
    private readonly coursesService: CoursesService,
  ) {}

  async getLecturesForCourse(courseId: string, userId: string, lastFetched?: string) {
    const course = await this.dataSource.query('SELECT id FROM courses WHERE id = ?', [courseId]);
    if (!course.length) throw new NotFoundException('Course not found');

    const isEnrolled = await this.coursesService.isUserEnrolledInCourse(userId, courseId);
    const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
    if (!isEnrolled && !isAdmin) throw new ForbiddenException('User is not enrolled in this course');

    const sections = await this.dataSource.query(
      'SELECT id, title, description FROM sections WHERE courseId = ?',
      [courseId],
    );

    const lectureFields = 'id, title, description, tags, sectionId';
    const result: any[] = [];
    for (const section of sections) {
      const params = [section.id, ...(lastFetched ? [lastFetched] : [])];
      const sectionLectures = await this.dataSource.query(
        `SELECT ${lectureFields} FROM lectures WHERE sectionId = ? ${lastFetched ? 'AND createdAt > ?' : ''} ORDER BY createdAt`,
        params,
      );
      const lecturesWithCourseId = sectionLectures.map((l: any) => ({ ...l, courseId }));
      if (lecturesWithCourseId.length > 0) {
        result.push({ ...section, lectures: lecturesWithCourseId });
      }
    }

    return { sections: result, lastFetched: getCurrentTimeInDBFormat() };
  }

  async getLecture(courseId: string, lectureId: string, userId: string, updatedAt?: string) {
    const course = await this.dataSource.query('SELECT id FROM courses WHERE id = ?', [courseId]);
    if (!course.length) throw new NotFoundException('Course not found');

    const isEnrolled = await this.coursesService.isUserEnrolledInCourse(userId, courseId);
    const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
    if (!isEnrolled && !isAdmin) throw new ForbiddenException('Not authorized');

    const [lecture] = await this.dataSource.query(
      'SELECT * FROM lectures WHERE id = ? AND courseId = ?',
      [lectureId, courseId],
    );
    if (!lecture) throw new NotFoundException('Lecture not found');

    if (updatedAt && lecture.updatedAt <= new Date(updatedAt)) {
      return { lectureData: null, upToDate: true };
    }

    const resources = await this.resourceRepository.find({ where: { lectureId } });
    return { lectureData: { ...lecture, resources } };
  }

  async getSectionsTitles(courseId: string, userId: string) {
    const isEnrolled = await this.coursesService.isUserEnrolledInCourse(userId, courseId);
    const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
    if (!isEnrolled && !isAdmin) throw new ForbiddenException('Not authorized');

    const sections = await this.dataSource.query(
      'SELECT id, title FROM sections WHERE courseId = ? ORDER BY createdAt',
      [courseId],
    );
    return sections;
  }

  async createLecture(courseId: string, userId: string, dto: CreateLectureDto) {
    const isAdmin = await this.coursesService.isCourseAdmin(userId, courseId);
    if (!isAdmin) throw new ForbiddenException('User is not a course admin');

    const id = uuidv4();
    await this.dataSource.query(
      `INSERT INTO lectures (id, title, description, tags, videoLink, notes, audioLink, slides, subtitles, transcript, userId, courseId, sectionId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, dto.title, dto.description, dto.tags || null, dto.videoLink, dto.notes, dto.audioLink || null, dto.slides || null, dto.subtitles || null, dto.transcript || null, userId, courseId, dto.sectionId],
    );

    if (dto.resources && dto.resources.length > 0) {
      for (const resource of dto.resources) {
        await this.dataSource.query(
          'INSERT INTO lectureResources (id, title, url, type, lectureId) VALUES (?, ?, ?, ?, ?)',
          [uuidv4(), resource.title, resource.url, resource.type, id],
        );
      }
    }

    const [lecture] = await this.dataSource.query('SELECT * FROM lectures WHERE id = ?', [id]);
    const resources = await this.resourceRepository.find({ where: { lectureId: id } });
    const [section] = await this.dataSource.query('SELECT * FROM sections WHERE id = ?', [dto.sectionId]);

    return { lecture: { ...lecture, resources }, section };
  }

  async updateLecture(lectureId: string, userId: string, dto: UpdateLectureDto) {
    const [lecture] = await this.dataSource.query('SELECT * FROM lectures WHERE id = ?', [lectureId]);
    if (!lecture) throw new NotFoundException('Lecture not found');

    const isAdmin = await this.coursesService.isCourseAdmin(userId, lecture.courseId);
    if (!isAdmin) throw new ForbiddenException('User is not a course admin');

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    const fields = ['title', 'description', 'tags', 'videoLink', 'notes', 'audioLink', 'slides', 'subtitles', 'transcript'];
    for (const field of fields) {
      if ((dto as any)[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push((dto as any)[field]);
      }
    }

    if (updateFields.length > 0) {
      await this.dataSource.query(
        `UPDATE lectures SET ${updateFields.join(', ')} WHERE id = ?`,
        [...updateValues, lectureId],
      );
    }

    if (dto.resources !== undefined) {
      await this.dataSource.query('DELETE FROM lectureResources WHERE lectureId = ?', [lectureId]);
      for (const resource of dto.resources) {
        await this.dataSource.query(
          'INSERT INTO lectureResources (id, title, url, type, lectureId) VALUES (?, ?, ?, ?, ?)',
          [uuidv4(), resource.title, resource.url, resource.type, lectureId],
        );
      }
    }

    const [updated] = await this.dataSource.query('SELECT * FROM lectures WHERE id = ?', [lectureId]);
    const resources = await this.resourceRepository.find({ where: { lectureId } });
    return { ...updated, resources };
  }

  async deleteLecture(lectureId: string, userId: string) {
    const [lecture] = await this.dataSource.query('SELECT * FROM lectures WHERE id = ?', [lectureId]);
    if (!lecture) throw new NotFoundException('Lecture not found');

    const isAdmin = await this.coursesService.isCourseAdmin(userId, lecture.courseId);
    if (!isAdmin) throw new ForbiddenException('User is not a course admin');

    await this.dataSource.query('DELETE FROM lectures WHERE id = ?', [lectureId]);
    return { message: 'Lecture deleted successfully', courseId: lecture.courseId, sectionId: lecture.sectionId };
  }

  async searchLectures(courseId: string, query: string) {
    const results = await this.dataSource.query(
      `SELECT id, title, description, tags, sectionId, courseId FROM lectures
       WHERE courseId = ? AND MATCH(title, description, tags) AGAINST(? IN BOOLEAN MODE)`,
      [courseId, query],
    );
    return { results, total: results.length, query };
  }
}
