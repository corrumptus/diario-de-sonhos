import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import User from './User';

@Entity()
export default class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", length: 200, nullable: true })
  title!: string | undefined;

  @Column('text')
  content!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: "integer", default: 0 })
  likes!: number;

  @ManyToOne(() => Post, { nullable: true, onDelete: 'CASCADE' })
  parentPost!: Post | undefined;

  @CreateDateColumn()
  createdAt!: Date;
}