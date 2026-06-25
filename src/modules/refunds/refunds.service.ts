import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  PrismaClient,
  BookingStatus,
  RefundStatus,
  TicketStatus,
} from '@prisma/client';
import { CreateRefundDto, ProcessRefundDto } from './dto/refund.dto';

const prisma = new PrismaClient();

@Injectable()
export class RefundsService {
  async create(dto: CreateRefundDto, userId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: {
        event: true,
        tickets: true,
        user: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.PAID) {
      throw new BadRequestException('Can only refund paid bookings');
    }

    // Check if any ticket has been checked in
    const checkedInTickets = booking.tickets.filter(
      (t) => t.status === TicketStatus.CHECKED_IN,
    );
    if (checkedInTickets.length > 0) {
      throw new BadRequestException(
        'Cannot refund booking with checked-in tickets',
      );
    }

    // Check refund deadline (e.g., 24 hours before event)
    const refundDeadline = new Date(
      booking.event.startDate.getTime() - 24 * 60 * 60 * 1000,
    );
    if (new Date() > refundDeadline) {
      throw new BadRequestException('Refund deadline has passed');
    }

    // Check if refund already exists
    const existingRefund = await prisma.refund.findFirst({
      where: {
        bookingId: dto.bookingId,
        status: { in: [RefundStatus.REQUESTED, RefundStatus.APPROVED] },
      },
    });

    if (existingRefund) {
      throw new BadRequestException(
        'Refund already requested for this booking',
      );
    }

    const refund = await prisma.refund.create({
      data: {
        userId,
        bookingId: dto.bookingId,
        amount: booking.totalPrice,
        reason: dto.reason,
      },
    });

    return refund;
  }

  async findAll(eventId?: string) {
    const where = eventId
      ? {
          booking: { eventId },
        }
      : {};

    const refunds = await prisma.refund.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        booking: {
          select: {
            id: true,
            totalPrice: true,
            event: { select: { id: true, name: true } },
          },
        },
      },
    });

    return { data: refunds };
  }

  async findOne(id: string) {
    const refund = await prisma.refund.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        booking: {
          include: {
            event: true,
            tickets: true,
          },
        },
      },
    });

    if (!refund) {
      throw new NotFoundException('Refund not found');
    }

    return refund;
  }

  async approve(id: string) {
    const refund = await prisma.refund.findUnique({ where: { id } });

    if (!refund) {
      throw new NotFoundException('Refund not found');
    }

    if (refund.status !== RefundStatus.REQUESTED) {
      throw new BadRequestException('Refund is not in requested status');
    }

    return prisma.refund.update({
      where: { id },
      data: {
        status: RefundStatus.APPROVED,
        processedAt: new Date(),
      },
    });
  }

  async reject(id: string, dto: ProcessRefundDto) {
    const refund = await prisma.refund.findUnique({ where: { id } });

    if (!refund) {
      throw new NotFoundException('Refund not found');
    }

    if (refund.status !== RefundStatus.REQUESTED) {
      throw new BadRequestException('Refund is not in requested status');
    }

    return prisma.refund.update({
      where: { id },
      data: {
        status: RefundStatus.REJECTED,
        reason: dto.reason,
        processedAt: new Date(),
      },
    });
  }

  async pay(id: string) {
    const refund = await prisma.refund.findUnique({
      where: { id },
      include: { booking: true },
    });

    if (!refund) {
      throw new NotFoundException('Refund not found');
    }

    if (refund.status !== RefundStatus.APPROVED) {
      throw new BadRequestException('Refund must be approved first');
    }

    // Update refund status
    const updatedRefund = await prisma.refund.update({
      where: { id },
      data: {
        status: RefundStatus.PAID_OUT,
        processedAt: new Date(),
      },
    });

    // Update booking and tickets status
    await prisma.booking.update({
      where: { id: refund.bookingId },
      data: { status: BookingStatus.CANCELLED },
    });

    await prisma.ticket.updateMany({
      where: { bookingId: refund.bookingId },
      data: { status: TicketStatus.REFUNDED },
    });

    return updatedRefund;
  }
}
