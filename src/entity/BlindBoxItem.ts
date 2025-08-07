// src/entity/BlindBoxItem.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BlindBox } from './BlindBox';
import { Order } from './Order';

@Entity()
export class BlindBoxItem {
  @OneToMany(() => Order, order => order.item)
  orders: Order[];

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column('decimal', { precision: 5, scale: 2 })
  probability: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => BlindBox, blindBox => blindBox.items, {
    onDelete: 'CASCADE',
  })
  blindBox: BlindBox;
}
