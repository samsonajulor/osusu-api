import {
  IsNotEmpty,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Duration, FrequencyOfSavings, PlanStatus } from '../enums';
import { User } from '../../entities/user.entity';
import { Column } from 'typeorm';

export class CreatePlanDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  numberOfBuddies: number;

  @IsOptional()
  @IsArray()
  buddies: User[];

  @IsNotEmpty()
  @IsBoolean()
  hasTarget: boolean;

  @IsNotEmpty()
  @IsBoolean()
  autoDebit: boolean;

  @IsNotEmpty()
  @IsEnum(FrequencyOfSavings)
  frequencyOfSavings: FrequencyOfSavings;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  endDate: Date;

  @IsNotEmpty()
  duration: Duration;

  @IsNotEmpty()
  targetSavingsAmount: number;
}

export class UpdatePlanDto {
  @IsOptional()
  title: string;

  @IsOptional()
  @IsArray()
  buddies: number[];

  @IsOptional()
  @IsBoolean()
  hasTarget: boolean;

  @IsOptional()
  @IsBoolean()
  autoDebit: boolean;

  @IsOptional()
  @IsEnum(FrequencyOfSavings)
  frequencyOfSavings: FrequencyOfSavings;

  @IsOptional()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsEnum(Duration)
  duration: Duration;

  @IsOptional()
  @IsNotEmpty()
  targetSavingsAmount: number;

  @IsOptional()
  @IsEnum(PlanStatus)
  status: PlanStatus;
}
