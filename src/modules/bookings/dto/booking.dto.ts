import {
  IsString,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BookingItemDto {
  @IsString()
  categoryId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateBookingDto {
  @IsString()
  eventId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingItemDto)
  items: BookingItemDto[];
}

export class PayBookingDto {
  @IsString()
  @IsOptional()
  paymentMethod?: string;
}
