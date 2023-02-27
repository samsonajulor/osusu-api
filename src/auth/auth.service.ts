import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OtpService } from '../otp/otp.service';
import { MailService } from 'src/email/email.service';
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
    private readonly emailService: MailService,
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
    console.log(user, '<<<<user>>>>');

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!user.password) {
      throw new HttpException(
        'User does not have a password. Create a new password first.',
        HttpStatus.BAD_REQUEST,
      );
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
   * Creates the user's password.
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

  /**
   * Sends reset password otp to the user's email.
   * @param {string} email - The email address of the user.
   * @returns {Promise<OTPDto>} The generated OTP.
   * @throws {Error} If the user does not exist in the database.
   * @throws {Error} If the user already has a password.
   * @memberof AuthService
   */
  async sendResetPasswordOtp(email: string): Promise<OTPDto> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!user.password) {
      throw new HttpException(
        'You have not set a password. Use create password to set a password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const otp = await this.otpService.generateOtp(email);

    await this.sendEmail(
      email,
      'Reset Password',
      `Your OTP is ${otp.code}. It will expire in 5 minutes.`,
    );

    return otp;
  }

  /**
   * Resets the user's password by invalidating the password field.
   * @param {string} email - The email address of the user.
   * @param {string} password - The new password.
   * @otp {string} otp - The OTP sent to the user's email.
   * @returns {Promise<UserDto>} The updated user.
   * @throws {Error} If the user does not exist in the database.
   * @throws {Error} If the OTP is invalid.
   * @memberof AuthService
   */
  async resetPassword(email: string, otp: string): Promise<UserDto> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isValidOtp = await this.otpService.verifyOtp(email, otp);

    if (isValidOtp) {
      // set the password to null
      return this.userService.update(user.id, { password: null });
    }

    throw new HttpException(
      'Something went wrong somewhere. Please check your input',
      HttpStatus.BAD_REQUEST,
    );
  }

  /**
   * Changes the user's password.
   * @param {string} email - The email address of the user.
   * @param {string} oldPassword - The old password.
   * @param {string} newPassword - The new password.
   * @returns {Promise<UserDto>} The updated user.
   * @throws {Error} If the user does not exist in the database.
   * @throws {Error} If the old password is invalid.
   * @memberof AuthService
   */
  async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<UserDto> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!user.password) {
      throw new HttpException(
        'You have not set a password. Use create password to set a password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordValid = await this.userService.comparePassword(
      oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    // hash the password
    const hashedPassword = await this.userService.hashPassword(newPassword);

    return this.userService.update(user.id, { password: hashedPassword });
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
