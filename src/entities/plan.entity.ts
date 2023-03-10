import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { winstonLogger, initWinston } from 'src/common/utilities';
import { Duration, FrequencyOfSavings, PlanStatus } from 'src/common/enums';

initWinston('Plan Entity', 'calling the initWinston function...');

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
    enum: Duration,
  })
  duration: Duration;

  @Column({ default: true })
  isSubscriptionOpen: boolean;

  @Column({ default: 'inactive' })
  status: PlanStatus;

  @Column()
  targetSavingsAmount: number;

  @ManyToMany(() => User, (user) => user.plans)
  buddies: User[];

  @AfterInsert()
  logInsert() {
    winstonLogger.info('PLAN Entity', `PLAN with id ${this.id} created`);
  }

  @AfterUpdate()
  logUpdate() {
    winstonLogger.info('PLAN Entity', `PLAN with id ${this.id} updated`);
  }

  @AfterRemove()
  logRemove() {
    winstonLogger.info('PLAN Entity', `PLAN with id ${this.id} removed`);
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
