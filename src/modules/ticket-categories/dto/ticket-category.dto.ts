import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';
import { RefundPolicy } from '@prisma/client';

export class CreateTicketCategoryDto {
  @IsString()
  eventId: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  quota: number;

  @IsDateString()
  salesStartDate: string;

  @IsDateString()
  salesEndDate: string;

  @IsEnum(RefundPolicy)
  @IsOptional()
  refundPolicy?: RefundPolicy;
}

export class UpdateTicketCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  quota?: number;

  @IsDateString()
  @IsOptional()
  salesStartDate?: string;

  @IsDateString()
  @IsOptional()
  salesEndDate?: string;

  @IsEnum(RefundPolicy)
  @IsOptional()
  refundPolicy?: RefundPolicy;
}
