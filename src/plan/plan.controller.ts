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
import {
  addBuddyToPlanDto,
  CreatePlanDto,
  UpdatePlanDto,
} from 'src/common/dtos';
import { SerializeResponse } from 'src/common/interceptors';
import { AuthGuard } from 'src/common/guards';

@Controller('plan')
@SerializeResponse()
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createPlan(@Body() body: CreatePlanDto) {
    // throw an error if endDate - startDate !== Duration

    return this.planService.create(body);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllPlans(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.planService.findAll(page, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getPlanById(@Param('id') id: number, @Query('title') title: string) {
    return title ? this.planService.findByTitle : this.planService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updatePlan(@Param('id') id: number, @Body() body: UpdatePlanDto) {
    return this.planService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePlan(@Param('id') id: number) {
    return this.planService.delete(id);
  }

  @Get('/:id/user')
  @UseGuards(AuthGuard)
  async getPlanUsers(@Param('id') id: number) {
    return this.planService.getRelatedUsers(id);
  }

  @Post('/:id/user')
  @UseGuards(AuthGuard)
  async addUserToPlan(
    @Param('id') id: number,
    @Body() body: addBuddyToPlanDto,
  ) {
    return this.planService.addUsersToPlan(id, body.buddies);
  }

  @Delete('/:id/user')
  @UseGuards(AuthGuard)
  async removePlanUser(
    @Param('id') id: number,
    @Body('users') userIds: number[],
  ) {
    return this.planService.removeUsersFromPlan(id, userIds);
  }
}
