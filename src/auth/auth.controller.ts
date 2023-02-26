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
import { Serialize, SerializeResponse } from 'src/common/interceptors';
import { GetCurrentUser } from './decorators';
import { User } from 'src/entities';
import { AuthGuard } from 'src/common/guards';

@SerializeResponse()
@Serialize(UserDto)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly emailService: MailService,
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

    const otp = await this.authService.register(body);

    await this.sendEmail(
      body.email,
      'Welcome',
      `Welcome to the app. Your OTP is ${otp.code}`,
    );

    return 'user created please check your mail.';
  }

  @Post('/change-password')
  async changePassword(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const hashedPW = await this.userService.hashPassword(password);

    user.password = hashedPW;

    await this.userService.update(user.id, user);

    return 'password changed';
  }

  /**
   * Sends an email to the user with the given email address.
   * @param email The email address of the user to send the email to.
   * @param subject The subject of the email.
   * @param content The content of the email.
   * @returns A promise that resolves when the email has been sent.
   * @throws {Error} If the email could not be sent.
   */
  async sendEmail(email: string, subject: string, content: string) {
    await this.emailService.sendEmail(email, subject, content);
  }
}
