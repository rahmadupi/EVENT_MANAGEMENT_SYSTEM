import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient, EventStatus, BookingStatus, TicketStatus } from '@prisma/client';
import { CreateBookingDto } from './dto/booking.dto';

const prisma = new PrismaClient();

function generateTicketCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'EVT-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code += '-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

@Injectable()
export class BookingsService {
  async create(eventId: string, dto: CreateBookingDto, userId: string) {
    const event = await prisma.event.findUnique({
      where: { id: dto.eventId },
      include: { categories: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status !== EventStatus.PUBLISHED) {
      throw new BadRequestException('Event is not available for booking');
    }

    // Check for existing pending booking
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId,
        eventId: dto.eventId,
        status: BookingStatus.PENDING_PAYMENT,
      },
    });

    if (existingBooking) {
      throw new BadRequestException('You already have a pending booking for this event');
    }

    // Validate categories and calculate total
    let totalPrice = 0;
    const bookingItems: Array<{
      ticketCategoryId: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }> = [];

    for (const item of dto.items) {
      const category = event.categories.find((c) => c.id === item.categoryId);

      if (!category || !category.isActive) {
        throw new BadRequestException(`Invalid ticket category: ${item.categoryId}`);
      }

      const now = new Date();
      if (now < category.salesStartDate || now > category.salesEndDate) {
        throw new BadRequestException('Ticket category is not available for purchase');
      }

      // Check quota
      const soldCount = await prisma.bookingItem.aggregate({
        where: { ticketCategoryId: category.id },
        _sum: { quantity: true },
      });

      const availableQuota = category.quota - (soldCount._sum.quantity || 0);
      if (item.quantity > availableQuota) {
        throw new BadRequestException(`Not enough tickets available for ${category.name}`);
      }

      const subtotal = Number(category.price) * item.quantity;
      totalPrice += subtotal;

      bookingItems.push({
        ticketCategoryId: category.id,
        quantity: item.quantity,
        unitPrice: Number(category.price),
        subtotal,
      });
    }

    // Create booking with 15 minute expiration
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const booking = await prisma.booking.create({
      data: {
        userId,
        eventId: dto.eventId,
        totalPrice,
        paymentDue: totalPrice,
        expiresAt,
        items: {
          create: bookingItems,
        },
      },
    });

    return {
      ...booking,
      items: bookingItems.map((item) => ({
        ...item,
        categoryName: event.categories.find((c) => c.id === item.ticketCategoryId)?.name,
      })),
    };
  }

  async findAll(userId: string, status?: BookingStatus) {
    const where = status ? { userId, status } : { userId };

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        event: { select: { id: true, name: true, startDate: true, location: true } },
        items: {
          include: { category: { select: { name: true } } },
        },
        tickets: { select: { id: true, code: true, status: true } },
      },
    });

    return { data: bookings };
  }

  async findOne(id: string, userId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        event: true,
        items: { include: { category: true } },
        tickets: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async pay(id: string, userId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { event: true, items: { include: { category: true } } },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.PENDING_PAYMENT) {
      throw new BadRequestException('Booking is not pending payment');
    }

    if (new Date() > booking.expiresAt) {
      await prisma.booking.update({
        where: { id },
        data: { status: BookingStatus.EXPIRED },
      });
      throw new BadRequestException('Payment deadline exceeded');
    }

    // Create tickets
    const tickets: Array<{
      id: string;
      code: string;
      status: TicketStatus;
    }> = [];
    for (const item of booking.items) {
      for (let i = 0; i < item.quantity; i++) {
        const ticket = await prisma.ticket.create({
          data: {
            bookingId: booking.id,
            eventId: booking.eventId,
            categoryId: item.ticketCategoryId,
            code: generateTicketCode(),
            status: TicketStatus.ACTIVE,
          },
        });
        tickets.push(ticket);
      }
    }

    // Update booking status
    const paidBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.PAID,
        paidAt: new Date(),
      },
    });

    return { ...paidBooking, tickets };
  }

  async cancel(id: string, userId: string) {
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.PENDING_PAYMENT) {
      throw new BadRequestException('Cannot cancel a paid booking');
    }

    return prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
  }
}