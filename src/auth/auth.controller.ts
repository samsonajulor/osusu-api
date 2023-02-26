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
import { CreateUserDto, UserDto, CreatePasswordDto } from 'src/common/dtos';
import { Serialize, SerializeResponse } from 'src/common/interceptors';
import { GetCurrentUser } from './decorators';
import { User } from 'src/entities';
import { AuthGuard } from 'src/common/guards';
import { LoginUserDto, ResetPasswordDto } from '../common/dtos/user.dto';

@SerializeResponse()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
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

    await this.authService.sendEmail(
      body.email,
      'Welcome',
      `Welcome to the app. Your OTP is ${otp.code}`,
    );

    return 'user created please check your mail.';
  }

  @Post('/login')
  @Serialize(UserDto)
  async login(@Body() body: LoginUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.login(email, password);

    session.userId = user.id;

    return user;
  }

  @Post('/create-password')
  async createPassword(@Body() body: CreatePasswordDto) {
    const { email, password, confirmPassword } = body;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.password) {
      throw new HttpException(
        'User already has a password. Please login.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const hashedPW = await this.userService.hashPassword(password);

    user.password = hashedPW;

    await this.userService.update(user.id, user);

    return 'password changed';
  }

  @Post('/spo')
  async sendResetPasswordOtp(@Body('email') email: string) {
    return await this.authService.sendResetPasswordOtp(email);
  }

  @Post('/reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.authService.resetPassword(body.email, body.otp);

    return 'password reset successful. Please create a new one';
  }
}
