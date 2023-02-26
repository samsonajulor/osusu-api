import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { Plan, User } from 'src/entities';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, User])],
  providers: [PlanService, UserService],
  controllers: [PlanController],
})
export class PlanModule {}
