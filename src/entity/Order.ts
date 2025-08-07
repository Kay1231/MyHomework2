import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';
import { BlindBox } from './BlindBox';
import { BlindBoxItem } from './BlindBoxItem';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => BlindBox, blindBox => blindBox.orders)
  @JoinColumn({ name: 'blindBoxId' })
  blindBox: BlindBox;

  @ManyToOne(() => BlindBoxItem, item => item.orders)
  @JoinColumn({ name: 'itemId' })
  item: BlindBoxItem;

  @CreateDateColumn()
  createdAt: Date;

  // 简化的订单状态 (由于移除了支付系统)
  @Column({ default: 'completed' })
  status: string; // 'completed' 表示已完成
}
