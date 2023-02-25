import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsOptional()
  @IsPhoneNumber('NG')
  @MaxLength(11, {
    message: 'phone number should not exceed 11 characters.',
  })
  @MinLength(11, {
    message: 'phone number should not be less than 11 characters.',
  })
  @Matches(
    /((^234)[0-9]{10})|((^0)(7|8|9){1}(0|1){1}[0-9]{8})|((^234)[0-9]{10})/,
    {
      message: 'phone number should be of the format 08112345678',
    },
  )
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
