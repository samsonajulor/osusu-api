import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../entities/plan.entity';
import { CreatePlanDto } from '../common/dtos/plan.dto';
import { User } from 'src/entities';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    private readonly userService: UserService,
  ) {}

  /**
   * Finds a plan by its id.
   * @param id The id of the plan to search for.
   * @returns A promise that resolves to either a plan with the given id or undefined if no plan is found.
   * @memberof PlanService
   */
  async findById(id: number): Promise<Plan | undefined> {
    if (!id) return null;

    return this.planRepository.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * Get a plan by its title
   * @param title The title of the plan to search for.
   * @returns A promise that resolves to either a plan with the given title or undefined if no plan is found.
   * @memberof PlanService
   */
  async findByTitle(title: string): Promise<Plan | undefined> {
    if (!title) return null;

    return this.planRepository.findOne({
      where: {
        title,
      },
    });
  }

  /**
   * Finds all Plan entities
   * @param page - The page number to return (optional)
   * @param limit - The number of Plans per page (optional, default is 10)
   * @returns An array of Plan objects
   */
  async findAll(page?: number, limit?: number): Promise<Plan[]> {
    const take = limit || 10;
    const skip = page ? (page - 1) * take : 0;
    return this.planRepository.find({
      take,
      skip,
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Creates a new Plan entity
   * @param plan - The Plan object to create
   * @returns The newly created Plan object
   * @memberof PlanService
   */
  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    const plan = await this.planRepository.create(createPlanDto);
    return this.planRepository.save(plan);
  }

  /**
   * Updates a Plan
   * @param plan - The Plan object to update
   * @returns The updated Plan object
   * @memberof PlanService
   */
  async update(id: number, updateUserDto: Partial<Plan>): Promise<Plan> {
    const plan = await this.findById(id);

    if (!plan) {
      throw new HttpException('Plan not found', HttpStatus.NOT_FOUND);
    }

    return this.planRepository.save(updateUserDto);
  }

  /**
   * Delete a Plan
   * @param id - The id of the Plan to delete
   * @returns The deleted Plan object
   * @memberof PlanService
   */
  async delete(id: number): Promise<Plan> {
    const plan = await this.findById(id);

    if (!plan) {
      throw new HttpException('Plan not found', HttpStatus.NOT_FOUND);
    }

    return this.planRepository.remove(plan);
  }

  /**
   * Gets the users associated with a Plan
   * @param planId - The id of the Plan to get users for
   * @returns An array of User objects
   */
  async getRelatedUsers(planId: number): Promise<User[]> {
    return this.planRepository
      .createQueryBuilder('plan')
      .relation('buddies')
      .of(planId)
      .loadMany();
  }

  /**
   * Adds users to a Plan
   * @param planId - The id of the Plan to add users to
   * @param userIds - An array of user ids to add to the Plan
   * @returns The updated Plan object
   * @memberof PlanService
   */
  async addUsersToPlan(planId: number, userIds: number[]): Promise<string> {
    const plan = await this.findById(planId);

    if (!plan) {
      throw new HttpException('Plan not found', HttpStatus.NOT_FOUND);
    }

    const users = await this.getRelatedUsers(planId);

    // check if the user is already in the plan
    const newUsers = userIds.filter((userId) => {
      return !users.find((user) => user.id === userId);
    });

    if (newUsers.length === 0) {
      return `No new users to add to plan ${planId}`;
    }

    /** Check if new users exists in the users service */
    const notFound = [];
    for (const userId of userIds) {
      const user = await this.userService.findById(userId);

      if (!user) {
        notFound.push(userId);
      }
    }

    if (notFound.length > 0) {
      throw new HttpException(
        `Users with ids ${notFound.join(', ')} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.planRepository
      .createQueryBuilder('plan')
      .relation('buddies')
      .of(planId)
      .add(newUsers);

    return `Successfully added ${newUsers.length} new users with id(s) ${newUsers} to plan ${planId}`;
  }
}
