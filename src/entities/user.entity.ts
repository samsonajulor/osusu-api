import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Plan } from './plan.entity';
import { winstonLogger, initWinston } from 'src/common/utilities';

initWinston('Plan Entity', 'calling the initWinston function...');

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ unique: true, nullable: true })
  accountNumber: string;

  @Column({ default: false })
  isVerified: boolean;

  @ManyToMany(() => Plan, (plan) => plan.buddies, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  plans: Plan[];

  @AfterInsert()
  logInsert() {
    winstonLogger.info('USER Entity', `USER with id ${this.id} created`);
  }

  @AfterUpdate()
  logUpdate() {
    winstonLogger.info('USER Entity', `USER with id ${this.id} updated`);
  }

  @AfterRemove()
  logRemove() {
    winstonLogger.info('USER Entity', `USER with id ${this.id} removed`);
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
