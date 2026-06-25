import { IsString } from 'class-validator';

export class ValidateTicketDto {
  @IsString()
  ticketCode: string;

  @IsString()
  eventId: string;
}

export class CheckInTicketDto {
  @IsString()
  ticketCode: string;

  @IsString()
  eventId: string;
}