import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import User from './User';
import Post from './Post';

@Entity()
@Unique(['user', 'post'])
export default class Like {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Post)
  post!: Post;
}