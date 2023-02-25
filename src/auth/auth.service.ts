import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { OtpService } from './otp.service';
import { CreateUserDto } from './dto/create-user.dto';
import { OtpDto } from './dto/otp.dto';

@Injectable()
export class AuthService {
  /**
   * Creates an instance of AuthService.
   *
   * @param {Repository<User>} userRepository
   * @param {OtpService} otpService
   * @memberof AuthService
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly otpService: OtpService,
  ) {}

  /**
   * Registers a new user by creating a new user in the database and generating an OTP
   * which is sent to the user's email for verification.
   *
   * @param {CreateUserDto} createUserDto - The DTO object containing the user's email and other details.
   * @returns {Promise<OtpDto>} The generated OTP code.
   * @throws {Error} If the user already exists in the database.
   * @memberof AuthService
   */
  async register(createUserDto: CreateUserDto): Promise<OtpDto> {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create new user
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);

    // Generate OTP
    const otp = await this.otpService.generateOtp(user.email);

    // Return OTP
    return otp;
  }
}
