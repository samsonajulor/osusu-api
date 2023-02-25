import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OTP } from '../entities';
import { OTPDto } from '../common/dtos';
import { randomBytes } from 'crypto';
import { UserService } from '../user/user.service';
import { OtpStatus } from 'src/common/enums';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
    private readonly userService: UserService,
  ) {}

  /**
   * Gets otp by email
   * @param email The email address of the user to generate an OTP for.
   * @returns The newly generated OTP.
   */
  async getOtpByEmail(email: string): Promise<OTPDto> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const otp = await this.otpRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (!otp) {
      throw new HttpException('OTP not found', HttpStatus.NOT_FOUND);
    }

    return otp;
  }

  /**
   * Update otp status
   * @param email The email address of the user to generate an OTP for.
   * @returns The newly generated OTP.
   */
  async updateOtpStatus(id: number, status: OtpStatus): Promise<OTPDto> {
    const otp = await this.otpRepository.findOne({
      where: {
        id,
      },
    });

    if (!otp) {
      throw new HttpException('OTP not found', HttpStatus.NOT_FOUND);
    }

    otp.status = status;

    const savedOtp = await this.otpRepository.save(otp);

    return savedOtp;
  }
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

  /**
   * Verify the OTP provided by the user for a given email address.
   *
   * @param email - The email address for which the OTP was generated.
   * @param otp - The OTP provided by the user.
   * @returns A Promise that resolves to a boolean indicating whether the OTP is valid or not.
   * @throws BadRequestException - If the email address or OTP is not provided or invalid.
   * @throws NotFoundException - If no OTP is found for the provided email address.
   * @throws UnauthorizedException - If the provided OTP is incorrect.
   */
  async verifyOtp(email: string, otp: string): Promise<boolean> {
    if (!email || !otp) {
      throw new HttpException('Invalid email or OTP', HttpStatus.BAD_REQUEST);
    }

    const otpRecord = await this.otpRepository.findOne({
      where: {
        email,
      },
    });

    if (!otpRecord) {
      throw new HttpException('OTP not found', HttpStatus.NOT_FOUND);
    }

    if (otpRecord.code !== otp) {
      throw new HttpException('Invalid OTP', HttpStatus.UNAUTHORIZED);
    }

    // Check if the OTP is expired
    const now = new Date();
    const otpExpiry = new Date(otpRecord.createdAt);

    // Set the expiry time to 5 minutes
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

    if (now > otpExpiry) {
      throw new HttpException('OTP expired', HttpStatus.UNAUTHORIZED);
    }

    // Update the OTP status to used
    await this.updateOtpStatus(otpRecord.id, OtpStatus.USED);

    return true;
  }
}
