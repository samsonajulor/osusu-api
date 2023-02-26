import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { UserService } from 'src/user/user.service';
import { OtpController } from './otp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, OTP } from 'src/entities';
import { EmailModule } from 'src/email/email.module';
import { MailService } from 'src/email/email.service';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([User, OTP])],
  providers: [OtpService, UserService, MailService],
  controllers: [OtpController],
  exports: [MailService],
})
export class OtpModule {}
