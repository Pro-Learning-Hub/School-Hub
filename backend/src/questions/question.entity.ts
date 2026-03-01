import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('questions')
export class Question {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ default: 0 })
  upvotes: number;

  @Column({ default: 0 })
  repliesCount: number;

  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  lectureId: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  courseId: string;
}
