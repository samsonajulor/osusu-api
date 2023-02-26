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
import { VerifyOtpDto } from 'src/common/dtos';
import { Cron } from '@nestjs/schedule';
import { SerializeResponse } from '../common/interceptors';
import { OtpService } from './otp.service';

@Controller('otp')
@SerializeResponse()
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('/verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return this.otpService.verifyOtp(body.email, body.code);
  }

  // Runs every hour (at the 0th minute of the hour)
  @Cron('0 * * * *')
  async handleExpireOTPCron() {
    await this.otpService.expireOtps();
  }

  @Post('/resend')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() body: VerifyOtpDto) {
    return this.otpService.resendOtp(body.email);
  }
}
