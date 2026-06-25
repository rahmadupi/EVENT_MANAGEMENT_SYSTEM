import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TicketCategoriesService } from './ticket-categories.service';
import { CreateTicketCategoryDto, UpdateTicketCategoryDto } from './dto/ticket-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('events/:eventId/categories')
export class TicketCategoriesController {
  constructor(private readonly ticketCategoriesService: TicketCategoriesService) {}

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.ticketCategoriesService.findAll(eventId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketCategoriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EVENT_ORGANIZER, UserRole.SYSTEM_ADMIN)
  create(@Param('eventId') eventId: string, @Body() dto: CreateTicketCategoryDto) {
    return this.ticketCategoriesService.create(eventId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EVENT_ORGANIZER, UserRole.SYSTEM_ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateTicketCategoryDto) {
    return this.ticketCategoriesService.update(id, dto);
  }

  @Patch(':id/disable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EVENT_ORGANIZER, UserRole.SYSTEM_ADMIN)
  disable(@Param('id') id: string) {
    return this.ticketCategoriesService.disable(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EVENT_ORGANIZER, UserRole.SYSTEM_ADMIN)
  remove(@Param('id') id: string) {
    return this.ticketCategoriesService.remove(id);
  }
}