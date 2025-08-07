// src/entity/BlindBox.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BlindBoxItem } from './BlindBoxItem';
import { Order } from './Order';
import { Comment } from './Comment';

@Entity()
export class BlindBox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  coverImage: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => BlindBoxItem, item => item.blindBox, { cascade: true })
  items: BlindBoxItem[];

  @OneToMany(() => Order, order => order.blindBox)
  orders: Order[];

  @OneToMany(() => Comment, comment => comment.blindBox)
  comments: Comment[];
}
