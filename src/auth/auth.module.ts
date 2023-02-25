import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { AuthService } from './auth.service';
import { OtpService } from 'src/otp/otp.service';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { User } from 'src/entities/user.entity';
import { OTP } from 'src/entities/otp.entity';
import { MailService } from '../email/email.service';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([User, OTP])],
  providers: [AuthService, OtpService, UserService, MailService],
  controllers: [AuthController],
  exports: [MailService],
})
export class AuthModule {}
