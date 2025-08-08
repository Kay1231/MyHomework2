import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BoxItem } from './box-item.entity';
import { Comment } from './comment.entity';

@Entity()
export class Box {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @OneToMany(() => BoxItem, item => item.box)
  items: BoxItem[];

  @OneToMany(() => Comment, comment => comment.box)
comments: Comment[];
}
