import { IsString, Length, IsEmail } from 'class-validator';
import { Transform, Expose } from 'class-transformer';

export class OTPDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  code: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class CreateOtpDto {
  @IsString()
  readonly email: string;
}

export class VerifyOtpDto {
  @IsString()
  @Length(6, 6)
  @Transform(({ value }) => value.trim())
  readonly code: string;

  @IsEmail()
  readonly email: string;
}

export class ResendOtpDto {
  @IsEmail()
  readonly email: string;
}
