import {
  IsNotEmpty,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsArray,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Duration, FrequencyOfSavings, PlanStatus } from '../enums';

export class CreatePlanDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @Min(0)
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
  @Min(0)
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
  @Min(0)
  targetSavingsAmount: number;

  @IsOptional()
  @IsBoolean()
  isSubscriptionOpen: boolean;
}

export class addBuddyToPlanDto {
  @IsNotEmpty()
  @IsArray()
  buddies: number[];
}

export class UpdatePlanStatusDto {
  @IsNotEmpty()
  @IsEnum(PlanStatus)
  status: PlanStatus;
}
