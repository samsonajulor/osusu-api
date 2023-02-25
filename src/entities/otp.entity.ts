import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { winstonLogger, initWinston } from 'src/common/utilities';

initWinston('OTP Entity', 'calling the initWinston function...');

@Entity()
export class OTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: ['idle', 'used', 'expired'],
    default: 'idle',
  })
  status: 'idle' | 'used' | 'expired';

  @AfterInsert()
  logInsert() {
    winstonLogger.info('OTP Entity', `OTP with id ${this.id} created`);
  }

  @AfterUpdate()
  logUpdate() {
    winstonLogger.info('OTP Entity', `OTP with id ${this.id} updated`);
  }

  @AfterRemove()
  logRemove() {
    winstonLogger.info('OTP Entity', `OTP with id ${this.id} removed`);
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
