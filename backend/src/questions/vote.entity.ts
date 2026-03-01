import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('votes')
export class Vote {
  @CreateDateColumn()
  createdAt: Date;

  @PrimaryColumn({ type: 'varchar', length: 36 })
  userId: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  questionId: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  replyId: string;
}
