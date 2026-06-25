import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient, EventStatus } from '@prisma/client';
import { CreateEventDto, UpdateEventDto, EventQueryDto } from './dto/event.dto';

const prisma = new PrismaClient();

@Injectable()
export class EventsService {
  async create(dto: CreateEventDto, userId: string) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate < startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    if (dto.maxCapacity <= 0) {
      throw new BadRequestException('Max capacity must be greater than 0');
    }

    const event = await prisma.event.create({
      data: {
        name: dto.name,
        description: dto.description,
        startDate,
        endDate,
        location: dto.location,
        maxCapacity: dto.maxCapacity,
        createdBy: userId,
      },
    });

    return event;
  }

  async findAll(query: EventQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where = query.status ? { status: query.status } : {};

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          categories: {
            where: { isActive: true },
            select: { id: true, name: true, price: true, quota: true },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    return {
      data: events,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        categories: {
          where: { isActive: true },
        },
        _count: {
          select: { bookings: true, tickets: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(id: string, dto: UpdateEventDto) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (dto.startDate && dto.endDate) {
      const startDate = new Date(dto.startDate);
      const endDate = new Date(dto.endDate);
      if (endDate < startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    return prisma.event.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async publish(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { categories: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status === EventStatus.CANCELLED) {
      throw new BadRequestException('Cannot publish a cancelled event');
    }

    const activeCategories = event.categories.filter((c) => c.isActive);
    if (activeCategories.length === 0) {
      throw new BadRequestException(
        'Event must have at least one active ticket category',
      );
    }

    const totalQuota = activeCategories.reduce((sum, c) => sum + c.quota, 0);
    if (totalQuota > event.maxCapacity) {
      throw new BadRequestException(
        'Total ticket quota exceeds maximum event capacity',
      );
    }

    return prisma.event.update({
      where: { id },
      data: { status: EventStatus.PUBLISHED },
    });
  }

  async cancel(id: string) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return prisma.event.update({
      where: { id },
      data: { status: EventStatus.CANCELLED },
    });
  }

  async remove(id: string) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await prisma.event.delete({ where: { id } });
    return { message: 'Event deleted successfully' };
  }
}
