import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { CreateRefundDto, ProcessRefundDto } from './dto/refund.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('refunds')
@UseGuards(JwtAuthGuard)
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.EVENT_ORGANIZER, UserRole.SYSTEM_ADMIN)
  findAll(@Query('eventId') eventId?: string) {
    return this.refundsService.findAll(eventId);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.EVENT_ORGANIZER, UserRole.SYSTEM_ADMIN, UserRole.CUSTOMER)
  findOne(@Param('id') id: string) {
    return this.refundsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.CUSTOMER)
  create(@Body() dto: CreateRefundDto, @Request() req) {
    return this.refundsService.create(dto, req.user.id);
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.EVENT_ORGANIZER, UserRole.SYSTEM_ADMIN)
  approve(@Param('id') id: string) {
    return this.refundsService.approve(id);
  }

  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(UserRole.EVENT_ORGANIZER, UserRole.SYSTEM_ADMIN)
  reject(@Param('id') id: string, @Body() dto: ProcessRefundDto) {
    return this.refundsService.reject(id, dto);
  }

  @Patch(':id/pay')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  pay(@Param('id') id: string) {
    return this.refundsService.pay(id);
  }
}