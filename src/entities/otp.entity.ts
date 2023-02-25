import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: ['idle', 'used', 'expired'],
    default: 'idle',
  })
  status: 'idle' | 'used' | 'expired';
}
