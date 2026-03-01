import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Course } from './course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
    private readonly dataSource: DataSource,
  ) {}

  async findById(id: string): Promise<Course | null> {
    return this.coursesRepository.findOne({ where: { id } });
  }

  async isCourseAdmin(userId: string, courseId: string): Promise<boolean> {
    const result = await this.dataSource.query(
      'SELECT 1 FROM courseAdmins WHERE courseId = ? AND userId = ?',
      [courseId, userId],
    );
    return result.length > 0;
  }

  async isUserEnrolledInCourse(userId: string, courseId: string): Promise<boolean> {
    const result = await this.dataSource.query(
      'SELECT 1 FROM courseEnrollments WHERE courseId = ? AND userId = ?',
      [courseId, userId],
    );
    return result.length > 0;
  }
}
