import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';

enum FrequencyOfSavings {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  numberOfBuddies: number;

  @Column()
  hasTarget: boolean;

  @Column()
  autoDebit: boolean;

  @Column({
    type: 'enum',
    enum: FrequencyOfSavings,
  })
  frequencyOfSavings: FrequencyOfSavings;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  creator: string;

  @Column({
    type: 'enum',
    enum: [3, 6, 12],
  })
  duration: number;

  @ManyToMany(() => User)
  @JoinTable()
  buddies: User[];
}
