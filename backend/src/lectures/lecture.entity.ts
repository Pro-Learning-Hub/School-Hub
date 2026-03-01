import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('lectures')
export class Lecture {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  tags: string;

  @Column()
  videoLink: string;

  @Column()
  notes: string;

  @Column({ nullable: true })
  audioLink: string;

  @Column({ nullable: true })
  slides: string;

  @Column({ nullable: true })
  subtitles: string;

  @Column({ nullable: true })
  transcript: string;

  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Column({ type: 'varchar', length: 36 })
  courseId: string;

  @Column({ type: 'varchar', length: 36 })
  sectionId: string;
}
