import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { OtpService } from 'src/otp/otp.service';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { User } from 'src/entities/user.entity';
import { OTP } from 'src/entities/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, OTP])],
  providers: [AuthService, OtpService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
