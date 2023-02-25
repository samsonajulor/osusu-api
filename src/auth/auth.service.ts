import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OtpService } from '../otp/otp.service';
import { UserService } from '../user/user.service';
import { CreateUserDto, UserDto } from '../common/dtos';

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
    private readonly userService: UserService,
    private readonly otpService: OtpService,
  ) {}

  /**
   * Registers a new user by creating a new user in the database and generating an OTP
   * which is sent to the user's email for verification.
   *
   * @param {CreateUserDto} createUserDto - The DTO object containing the user's email and other details.
   * @returns {Promise<UserDto>} The registered user.
   * @throws {Error} If the user already exists in the database.
   * @memberof AuthService
   */
  async register(createUserDto: CreateUserDto): Promise<string> {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email as string,
    );
    if (existingUser) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create new user
    const user = await this.userService.create(createUserDto);

    // Generate OTP
    const otp = await this.otpService.generateOtp(user.email);

    // Return OTP
    return 'user created please check your mail.';
  }
}
