import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserBox } from './user-box.entity';
import { Comment } from './comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // 明文存储（按需求）

  @OneToMany(() => UserBox, userBox => userBox.user)
  userBoxes: UserBox[];

  @OneToMany(() => Comment, comment => comment.user)
comments
: Comment[];
}
