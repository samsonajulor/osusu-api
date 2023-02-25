import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { MailService } from 'src/email/email.service';
import { OtpService } from 'src/otp/otp.service';
import { CreateUserDto, UserDto } from 'src/common/dtos';
import { Serialize } from 'src/common/interceptors';
import { GetCurrentUser } from './decorators';
import { User } from 'src/entities';
import { AuthGuard } from 'src/common/guards';

@Serialize(UserDto)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly emailService: MailService,
    private readonly otpService: OtpService,
  ) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: CreateUserDto) {
    const userExists = await this.userService.findByEmail(body.email);

    if (userExists) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.authService.register(body);

    const otp = await this.otpService.generateOtp(body.email);

    await this.sendEmail(
      body.email,
      'Welcome',
      `Welcome to the app. Your OTP is ${otp.code}`,
    );

    return 'user created please check your mail.';
  }

  async sendEmail(email: string, subject: string, content: string) {
    await this.emailService.sendEmail(email, subject, content);
  }
}
