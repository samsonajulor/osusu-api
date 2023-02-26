import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import { OTP } from '../entities';
import { OTPDto } from '../common/dtos';
import { randomBytes } from 'crypto';
import { UserService } from '../user/user.service';
import { MailService } from '../email/email.service';
import { OtpStatus, OTPDuration } from 'src/common/enums';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
    private readonly userService: UserService,
    private readonly emailService: MailService,
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
    return this.otpRepository.save({
      code: otpCode,
      email: user.email,
    });
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
        status: OtpStatus.IDLE,
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

  async expireOtps() {
    const expiredOtps = await this.findExpiredOtps();
    expiredOtps.forEach(async (otp) => {
      otp.status = OtpStatus.EXPIRED;
      await this.otpRepository.save(otp);
    });
  }

  /**
   * Finds all expired OTPs.
   * @returns A Promise that resolves to an array of expired OTPs.
   */
  async findExpiredOtps(): Promise<OTP[]> {
    const now = new Date();
    const expiredOtps = await this.otpRepository.find({
      where: {
        createdAt: LessThan(new Date(now.getTime() - OTPDuration.FIVE_MINUTES)),
        status: OtpStatus.USED || OtpStatus.IDLE,
      },
    });
    return expiredOtps;
  }

  /**
   * Resend otp
   * @param email The email address of the user to generate an OTP for.
   * @returns The newly generated OTP.
   */
  async resendOtp(email: string): Promise<OTPDto> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const otp = await this.otpRepository.findOne({
      where: {
        email: user.email,
        status: In([OtpStatus.IDLE, OtpStatus.USED]),
      },
    });

    if (!otp) {
      throw new HttpException('OTP not found', HttpStatus.NOT_FOUND);
    }

    const newOtp = await this.generateOtp(user.email);

    await this.sendEmail(
      user.email,
      'New OTP',
      `Here is the OTP again. Your OTP is ${newOtp.code}`,
    );

    return newOtp;
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
