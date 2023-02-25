import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { UserService } from 'src/user/user.service';
import { OtpController } from './otp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, OTP } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, OTP])],
  providers: [OtpService, UserService],
  controllers: [OtpController],
})
export class OtpModule {}
