import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OTP } from '../entities';
import { OTPDto } from '../common/dtos';
import { randomBytes } from 'crypto';
import { UserService } from '../user/user.service';

@Injectable()
export class GenerateOtpService {
  constructor(
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
    private readonly userService: UserService,
  ) {}

  /**
   * Generates a new OTP for the given user and saves it to the database.
   * @param email The email address of the user to generate an OTP for.
   * @returns The newly generated OTP.
   */
  async generateOtp(email: string): Promise<OTPDto> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    // Generate a new 6-digit OTP
    const otpCode = randomBytes(3).toString('hex');
    const otp = this.otpRepository.create({
      code: otpCode,
      email: user.email,
    });

    // Save the OTP to the database
    const savedOtp = await this.otpRepository.save(otp);

    return {
      id: savedOtp.id,
      code: savedOtp.code,
      status: savedOtp.status,
      email: savedOtp.email,
      createdAt: savedOtp.createdAt,
      updatedAt: savedOtp.updatedAt,
    };
  }
}
