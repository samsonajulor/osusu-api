import { IsString, IsEmail } from "class-validator";

export class CreateOtpDto {
  @IsString()
  readonly email: string;
}

export class VerifyOtpDto {
  @IsString()
  readonly code: string;

  @IsEmail()
  readonly email: string;
}

export class ResendOtpDto {
  @IsEmail()
  readonly email: string;
}
