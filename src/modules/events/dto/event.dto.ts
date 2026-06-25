import { IsString, IsDateString, IsInt, IsOptional, Min, IsEnum } from 'class-validator';
import { EventStatus } from '@prisma/client';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  location: string;

  @IsInt()
  @Min(1)
  maxCapacity: number;
}

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxCapacity?: number;
}

export class EventQueryDto {
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}