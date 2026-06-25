import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTicketCategoryDto, UpdateTicketCategoryDto } from './dto/ticket-category.dto';

const prisma = new PrismaClient();

@Injectable()
export class TicketCategoriesService {
  async findAll(eventId: string) {
    const categories = await prisma.ticketCategory.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate available quota
    const categoriesWithAvailability = await Promise.all(
      categories.map(async (category) => {
        const soldCount = await prisma.bookingItem.aggregate({
          where: { ticketCategoryId: category.id },
          _sum: { quantity: true },
        });
        const availableQuota = category.quota - (soldCount._sum.quantity || 0);
        return { ...category, availableQuota };
      })
    );

    return { data: categoriesWithAvailability };
  }

  async findOne(id: string) {
    const category = await prisma.ticketCategory.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!category) {
      throw new NotFoundException('Ticket category not found');
    }

    const soldCount = await prisma.bookingItem.aggregate({
      where: { ticketCategoryId: id },
      _sum: { quantity: true },
    });

    return {
      ...category,
      availableQuota: category.quota - (soldCount._sum.quantity || 0),
    };
  }

  async create(eventId: string, dto: CreateTicketCategoryDto) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { categories: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const salesStartDate = new Date(dto.salesStartDate);
    const salesEndDate = new Date(dto.salesEndDate);

    if (salesEndDate > event.startDate) {
      throw new BadRequestException('Ticket sales end date must be before event start date');
    }

    // Check total quota doesn't exceed event capacity
    const totalQuota = event.categories.reduce((sum, c) => sum + c.quota, 0) + dto.quota;
    if (totalQuota > event.maxCapacity) {
      throw new BadRequestException('Total ticket quota exceeds event capacity');
    }

    return prisma.ticketCategory.create({
      data: {
        eventId,
        name: dto.name,
        price: dto.price,
        quota: dto.quota,
        salesStartDate,
        salesEndDate,
        refundPolicy: dto.refundPolicy,
      },
    });
  }

  async update(id: string, dto: UpdateTicketCategoryDto) {
    const category = await prisma.ticketCategory.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!category) {
      throw new NotFoundException('Ticket category not found');
    }

    if (dto.salesStartDate && dto.salesEndDate) {
      const salesStartDate = new Date(dto.salesStartDate);
      const salesEndDate = new Date(dto.salesEndDate);
      if (salesEndDate > category.event.startDate) {
        throw new BadRequestException('Ticket sales end date must be before event start date');
      }
    }

    return prisma.ticketCategory.update({
      where: { id },
      data: {
        ...dto,
        salesStartDate: dto.salesStartDate ? new Date(dto.salesStartDate) : undefined,
        salesEndDate: dto.salesEndDate ? new Date(dto.salesEndDate) : undefined,
      },
    });
  }

  async disable(id: string) {
    const category = await prisma.ticketCategory.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException('Ticket category not found');
    }

    return prisma.ticketCategory.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async remove(id: string) {
    const category = await prisma.ticketCategory.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException('Ticket category not found');
    }

    await prisma.ticketCategory.delete({ where: { id } });
    return { message: 'Ticket category deleted successfully' };
  }
}