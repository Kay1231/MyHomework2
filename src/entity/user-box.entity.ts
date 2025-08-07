import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BoxItem } from './box-item.entity';

@Entity()
export class UserBox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  drawTime: Date;

  @ManyToOne(() => User, user => user.userBoxes)
  user: User;

  @ManyToOne(() => BoxItem)
  item: BoxItem;
}
