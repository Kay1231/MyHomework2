import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Box } from './box.entity';

@Entity()
export class BoxItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column('float')
  probability: number;

  @ManyToOne(() => Box, box => box.items)
  box: Box;
}
