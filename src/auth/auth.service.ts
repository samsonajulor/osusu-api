import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OtpService } from '../otp/otp.service';
import { UserService } from '../user/user.service';
import { CreateUserDto, UserDto } from '../common/dtos';
import { OTPDto } from '../common/dtos/otp.dto';

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
  async register(createUserDto: CreateUserDto): Promise<OTPDto> {
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
    return this.otpService.generateOtp(user.email);
  }

  /**
   * User is able to login with email and password
   * @param {string} email - The email address of the user.
   * @param {string} password - The password.
   */
  async login(email: string, password: string): Promise<UserDto> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await this.userService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  /**
   * Changes the user's password.
   * @param {string} email - The email address of the user.
   * @param {string} password - The new password.
   * @returns {Promise<UserDto>} The updated user.
   */
  async createPassword(email: string, password: string): Promise<UserDto> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.password) {
      throw new HttpException(
        'Already have a password. Use forgot password to reset password',
        HttpStatus.BAD_REQUEST,
      );
    }

    // hash the password
    const hashedPassword = await this.userService.hashPassword(password);

    return this.userService.update(user.id, { password: hashedPassword });
  }
}
