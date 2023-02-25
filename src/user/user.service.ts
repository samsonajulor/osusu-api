import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/common/dtos';
import { Repository } from 'typeorm';
import { User } from '../entities';

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
   * Creates a new user in the database.
   * @param createUserDto The DTO object containing the user's email and other details.
   * @returns A promise that resolves to the newly created user.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);

    return this.userRepository.save(user);
  }
}
