import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { UserService } from '../user/user.service';
import {
  addBuddyToPlanDto,
  CreatePlanDto,
  UpdatePlanDto,
} from 'src/common/dtos';
import { SerializeResponse } from 'src/common/interceptors';
import { AuthGuard } from 'src/common/guards';
import {
  isDatesEqualDuration,
  isStartDateBeforeEndDate,
} from 'src/common/utilities';

@Controller('plan')
@SerializeResponse()
export class PlanController {
  constructor(
    private readonly planService: PlanService,
    private userService: UserService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPlan(@Body() body: CreatePlanDto, @Session() session: any) {
    const plan = await this.planService.findByTitle(body.title);

    if (plan) {
      throw new HttpException(
        'Plan with this title already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.findById(session.userId);
    if (
      !isStartDateBeforeEndDate(
        new Date(body.startDate),
        new Date(body.endDate),
      )
    )
      throw new HttpException(
        'Start date must be before end date.',
        HttpStatus.BAD_REQUEST,
      );
    if (
      !isDatesEqualDuration(
        new Date(body.startDate),
        new Date(body.endDate),
        body.duration,
      )
    )
      throw new HttpException(
        'Duration must match the difference between start date and end date.',
        HttpStatus.BAD_REQUEST,
      );

    const data = {
      ...body,
      creator: user.email,
    };

    return this.planService.create(data);
  }

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllPlans(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.planService.findAll(page, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getPlanById(@Param('id') id: number, @Query('title') title: string) {
    return title ? this.planService.findByTitle : this.planService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updatePlan(@Param('id') id: number, @Body() body: UpdatePlanDto) {
    return this.planService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async deletePlan(@Param('id') id: number) {
    return this.planService.delete(id);
  }

  @Get('/:id/user')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getPlanUsers(@Param('id') id: number) {
    return this.planService.getRelatedUsers(id);
  }

  @Post('/:id/user')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async addUserToPlan(
    @Param('id') id: number,
    @Body() body: addBuddyToPlanDto,
  ) {
    return this.planService.addUsersToPlan(id, body.buddies);
  }

  @Delete('/:id/user')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async removePlanUser(
    @Param('id') id: number,
    @Body('users') userIds: number[],
  ) {
    return this.planService.removeUsersFromPlan(id, userIds);
  }
}
