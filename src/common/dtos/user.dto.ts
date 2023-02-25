import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsOptional()
  @IsPhoneNumber('NG')
  readonly phoneNumber?: string;

  @IsString()
  @Length(8, 20)
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsOptional()
  @IsPhoneNumber('NG')
  readonly phoneNumber?: string;

  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;
}

export class UpdatePasswordDto {
  @IsString()
  @Length(8, 20)
  readonly oldPassword: string;

  @IsString()
  @Length(8, 20)
  readonly newPassword: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  readonly email: string;
}
