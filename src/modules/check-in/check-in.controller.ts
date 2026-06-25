import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { ValidateTicketDto, CheckInTicketDto } from './dto/check-in.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('check-in')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.GATE_OFFICER, UserRole.EVENT_ORGANIZER, UserRole.SYSTEM_ADMIN)
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @Post('validate')
  validate(@Body() dto: ValidateTicketDto) {
    return this.checkInService.validate(dto);
  }

  @Post('tickets')
  checkIn(@Body() dto: CheckInTicketDto) {
    return this.checkInService.checkIn(dto);
  }

  @Get('events/:eventId/participants')
  getEventParticipants(
    @Param('eventId') eventId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20
  ) {
    return this.checkInService.getEventParticipants(eventId, +page, +limit);
  }
}