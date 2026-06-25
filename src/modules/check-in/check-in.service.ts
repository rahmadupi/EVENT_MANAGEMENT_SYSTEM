import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient, TicketStatus } from '@prisma/client';
import { ValidateTicketDto, CheckInTicketDto } from './dto/check-in.dto';

const prisma = new PrismaClient();

@Injectable()
export class CheckInService {
  async validate(dto: ValidateTicketDto) {
    const ticket = await prisma.ticket.findUnique({
      where: { code: dto.ticketCode },
      include: {
        category: { select: { name: true } },
        booking: { select: { user: { select: { name: true } } } },
        event: true,
      },
    });

    if (!ticket) {
      return { valid: false, message: 'Ticket not found' };
    }

    if (ticket.eventId !== dto.eventId) {
      return { valid: false, message: 'Ticket is for a different event' };
    }

    if (ticket.status === TicketStatus.CHECKED_IN) {
      return { valid: false, message: 'Ticket already checked in', checkedInAt: ticket.checkedInAt };
    }

    if (ticket.status !== TicketStatus.ACTIVE) {
      return { valid: false, message: `Ticket status is ${ticket.status}` };
    }

    // Check if it's event day
    const now = new Date();
    const eventDay = new Date(ticket.event.startDate);
    const isSameDay = now.toDateString() === eventDay.toDateString();
    
    if (!isSameDay && now < ticket.event.startDate) {
      return { valid: false, message: 'Check-in is only available on the event day' };
    }

    return {
      valid: true,
      ticket: {
        id: ticket.id,
        code: ticket.code,
        status: ticket.status,
        categoryName: ticket.category.name,
        holderName: ticket.booking.user.name,
      },
    };
  }

  async checkIn(dto: CheckInTicketDto) {
    const ticket = await prisma.ticket.findUnique({
      where: { code: dto.ticketCode },
      include: {
        category: { select: { name: true } },
        booking: { select: { user: { select: { name: true } } } },
        event: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (ticket.eventId !== dto.eventId) {
      throw new BadRequestException('Ticket is for a different event');
    }

    if (ticket.status === TicketStatus.CHECKED_IN) {
      throw new BadRequestException('Ticket already checked in');
    }

    if (ticket.status !== TicketStatus.ACTIVE) {
      throw new BadRequestException(`Cannot check in ticket with status ${ticket.status}`);
    }

    // Check if it's event day
    const now = new Date();
    const eventDay = new Date(ticket.event.startDate);
    const isSameDay = now.toDateString() === eventDay.toDateString();
    
    if (!isSameDay && now < ticket.event.startDate) {
      throw new BadRequestException('Check-in is only available on the event day');
    }

    const checkedInTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: TicketStatus.CHECKED_IN,
        checkedInAt: new Date(),
      },
    });

    return {
      success: true,
      ticket: {
        id: checkedInTicket.id,
        code: checkedInTicket.code,
        status: checkedInTicket.status,
        checkedInAt: checkedInTicket.checkedInAt,
      },
    };
  }

  async getEventParticipants(eventId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where: { eventId },
        skip,
        take: limit,
        orderBy: { checkedInAt: 'desc' },
        include: {
          category: { select: { name: true } },
          booking: { select: { user: { select: { name: true } } } },
        },
      }),
      prisma.ticket.count({
        where: { eventId, status: TicketStatus.CHECKED_IN },
      }),
    ]);

    return {
      data: tickets.map((t) => ({
        ticketId: t.id,
        ticketCode: t.code,
        holderName: t.booking.user.name,
        categoryName: t.category.name,
        checkedIn: t.status === TicketStatus.CHECKED_IN,
        checkedInAt: t.checkedInAt,
      })),
      meta: {
        totalParticipants: total,
        checkedInCount: total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}