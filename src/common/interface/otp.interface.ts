import { OtpStatus } from '../enums';

export interface Otp {
  id: number;
  code: string;
  status: OtpStatus;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
