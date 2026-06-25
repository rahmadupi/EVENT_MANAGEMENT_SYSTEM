import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, PayBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, BookingStatus } from '@prisma/client';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  findAll(@Request() req, @Query('status') status?: BookingStatus) {
    return this.bookingsService.findAll(req.user.id, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.bookingsService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(dto.eventId, dto, req.user.id);
  }

  @Patch(':id/pay')
  pay(@Param('id') id: string, @Request() req, @Body() dto: PayBookingDto) {
    return this.bookingsService.pay(id, req.user.id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Request() req) {
    return this.bookingsService.cancel(id, req.user.id);
  }
}