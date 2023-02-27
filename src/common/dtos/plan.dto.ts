import {
  IsNotEmpty,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsArray,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Duration, FrequencyOfSavings, PlanStatus } from '../enums';

export class CreatePlanDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @Max(5)
  numberOfBuddies: number;

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

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  @IsEnum(Duration)
  duration: Duration;

  @IsNotEmpty()
  targetSavingsAmount: number;
}

export class UpdatePlanDto {
  @IsOptional()
  title: string;

  @IsOptional()
  numberOfBuddies: number;

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
  startDate: Date;

  @IsOptional()
  @IsDateString()
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

  @IsOptional()
  @IsBoolean()
  isSubscriptionOpen: boolean;
}

export class addBuddyToPlanDto {
  @IsNotEmpty()
  @IsArray()
  buddies: number[];
}
