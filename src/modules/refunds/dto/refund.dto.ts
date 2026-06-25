import { IsString, IsOptional } from 'class-validator';

export class CreateRefundDto {
  @IsString()
  bookingId: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class ProcessRefundDto {
  @IsString()
  @IsOptional()
  reason?: string;
}