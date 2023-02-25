import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OTP, User } from '../entities';
import { OTPDto } from '../common/dtos';
import { randomBytes } from 'crypto';

@Injectable()
export class GenerateOtpService {
  constructor(
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Generates a new OTP for the given user and saves it to the database.
   * @param email The email address of the user to generate an OTP for.
   * @returns The newly generated OTP.
   */
  async generateOtp(email: string): Promise<OTPDto> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate a new 6-digit OTP
    const otpCode = randomBytes(3).toString('hex');
    const otp = new OTP();
    otp.email = user.email;
    otp.code = otpCode;

    // Save the OTP to the database
    const savedOtp = await this.otpRepository.save(otp);

    return {
      id: savedOtp.id,
      code: savedOtp.code,
      status: savedOtp.status,
      userId: savedOtp.user.id,
      createdAt: savedOtp.createdAt,
      updatedAt: savedOtp.updatedAt,
    };
  }
}
