import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { promisify } from 'util';
import { CreateUserDto, UpdateUserDto } from 'src/common/dtos';
import { Repository } from 'typeorm';
import { User } from '../entities';

const scrypt = promisify(_scrypt);
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Finds a user by their id.
   * @param id The id of the user to search for.
   * @returns A promise that resolves to either a user with the given id or undefined if no user is found.
   * @memberof UserService
   */
  async findById(id: number): Promise<User | undefined> {
    if (!id) return null;

    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * Finds a user by their email address.
   * @param email The email address to search for.
   * @returns A promise that resolves to either a user with the given email address or undefined if no user is found.
   */
  async findByEmail(email: string): Promise<User | undefined> {
    if (!email) return null;

    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  /**
   * Finds a user by their username.
   * @param username The username to search for.
   * @returns A promise that resolves to either a user with the given username or undefined if no user is found.
   */
  async findByUsername(username: string): Promise<User | undefined> {
    if (!username) return null;

    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  /**
   * Finds a user by phoneNumber
   * @param phoneNumber The phoneNumber to search for.
   * @returns A promise that resolves to either a user with the given phoneNumber or undefined if no user is found.
   */
  async findByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    if (!phoneNumber) return null;

    return this.userRepository.findOne({
      where: {
        phoneNumber,
      },
    });
  }

  /**
   * Finds all users in the database.
   * @returns A promise that resolves to an array of all users in the database.
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Creates a new user in the database.
   * @param createUserDto The DTO object containing the user's email and other details.
   * @returns A promise that resolves to the newly created user.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);

    return this.userRepository.save(user);
  }

  /**
   * Delete a user
   * @param id The id of the user to delete.
   * @returns A promise that resolves to the deleted user.
   */
  async delete(id: number): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.userRepository.remove(user);
  }

  /**
   * Update a user
   * @param id The id of the user to update.
   * @param createUserDto The DTO object containing the user's email and other details.
   * @returns A promise that resolves to the updated user.
   * @memberof UserService
   * @throws HttpException if the user is not found.
   * @throws HttpException if the user is trying to update their phone number to a phone number that is already in use.
   * @throws HttpException if the user is trying to update their username to a username that is already in use.
   */
  async update(
    id: number,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (updateUserDto.phoneNumber) {
      const existingUser = await this.findByPhoneNumber(
        updateUserDto.phoneNumber,
      );
      if (existingUser && existingUser.id !== id) {
        throw new HttpException(
          'Phone number already in use',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateUserDto.username) {
      const existingUser = await this.findByUsername(updateUserDto.username);
      if (existingUser && existingUser.id !== id) {
        throw new HttpException(
          'Username already in use',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
  }

  /**
   * hash a password
   * @param password The password to hash.
   * @returns A promise that resolves to the hashed password.
   * @memberof UserService
   */
  async hashPassword(password: string): Promise<string> {
    // hash the password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const hashedPw = salt + '.' + hash.toString('hex');

    return hashedPw;
  }

  /**
   * Compare a password with a hashed password
   * @param password The password to compare.
   * @param hashedPassword The hashed password to compare.
   * @returns A promise that resolves to true if the password matches the hashed password.
   * @memberof UserService
   * @throws HttpException if the password does not match the hashed password.
   * @throws HttpException if the hashed password is not in the correct format.
   */
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // check if the password matches the hashed password
    const [salt, storedHash] = hashedPassword.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      return false;
    }

    return true;
  }
}
