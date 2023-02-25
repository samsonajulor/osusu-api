import {
  IsNotEmpty,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FrequencyOfSavings, PlanStatus } from '../enums/plan.enum';

export class CreatePlanDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsArray()
  buddies: string[];

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
  startDate: string;

  @IsOptional()
  @Type(() => Date)
  endDate: Date;

  @IsNotEmpty()
  @IsDateString()
  duration: string;

  @IsOptional()
  @IsNotEmpty()
  targetSavingsAmount: number;
}

export class UpdatePlanDto {
  @IsOptional()
  title: string;

  @IsOptional()
  @IsArray()
  buddies: string[];

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
  @IsDateString()
  duration: string;

  @IsOptional()
  @IsNotEmpty()
  targetSavingsAmount: number;

  @IsOptional()
  @IsEnum(PlanStatus)
  status: PlanStatus;
}
