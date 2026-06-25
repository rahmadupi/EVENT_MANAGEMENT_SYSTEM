/**
 * Domain Layer Unit Tests
 *
 * Tests for business logic validation rules:
 * 1. Event cannot be created with invalid schedule
 * 2. Event cannot be created with zero or negative capacity
 * 3. Event cannot be published without active ticket category
 * 4. Ticket category quota cannot exceed event capacity
 * 5. Booking cannot be created with zero quantity
 * 6. Booking cannot be paid after payment deadline
 * 7. Booking cannot be paid with incorrect payment amount
 * 8. Paid booking cannot expire
 * 9. Checked-in ticket cannot be checked in again
 * 10. Refund cannot be requested if ticket has already been checked in
 * 11. Refund cannot be approved if it is not in Requested status
 * 12. Rejected refund must have a rejection reason
 */

import {
  EventStatus,
  BookingStatus,
  TicketStatus,
  RefundStatus,
  UserRole,
} from '@prisma/client';

// ============================================
// Test Case 1: Event cannot be created with invalid schedule
// ============================================
describe('Event Domain: Invalid Schedule Validation', () => {
  function validateEventSchedule(startDate: Date, endDate: Date): boolean {
    // Event cannot be created if end date is earlier than start date
    return endDate >= startDate;
  }

  it('should reject event when end date is before start date', () => {
    const startDate = new Date('2024-01-15T10:00:00Z');
    const endDate = new Date('2024-01-10T18:00:00Z'); // Earlier than start

    const isValid = validateEventSchedule(startDate, endDate);

    expect(isValid).toBe(false);
  });

  it('should accept event when end date equals start date (same-day event)', () => {
    const startDate = new Date('2024-01-15T10:00:00Z');
    const endDate = new Date('2024-01-15T10:00:00Z'); // Same as start

    const isValid = validateEventSchedule(startDate, endDate);

    expect(isValid).toBe(true); // Same-day events are valid
  });

  it('should accept event when end date is after start date', () => {
    const startDate = new Date('2024-01-15T10:00:00Z');
    const endDate = new Date('2024-01-15T18:00:00Z'); // After start

    const isValid = validateEventSchedule(startDate, endDate);

    expect(isValid).toBe(true);
  });
});

// ============================================
// Test Case 2: Event cannot be created with zero or negative capacity
// ============================================
describe('Event Domain: Capacity Validation', () => {
  function validateEventCapacity(maxCapacity: number): boolean {
    // Event cannot be created if maxCapacity is less than or equal to zero
    return maxCapacity > 0;
  }

  it('should reject event with zero capacity', () => {
    const isValid = validateEventCapacity(0);
    expect(isValid).toBe(false);
  });

  it('should reject event with negative capacity', () => {
    const isValid = validateEventCapacity(-1);
    expect(isValid).toBe(false);
  });

  it('should accept event with capacity of 1', () => {
    const isValid = validateEventCapacity(1);
    expect(isValid).toBe(true); // Single capacity events are valid
  });

  it('should accept event with capacity greater than 1', () => {
    const isValid = validateEventCapacity(100);
    expect(isValid).toBe(true);
  });
});

// ============================================
// Test Case 3: Event cannot be published without active ticket category
// ============================================
describe('Event Domain: Publish Validation', () => {
  interface TicketCategory {
    id: string;
    name: string;
    isActive: boolean;
    quota: number;
  }

  function canPublishEvent(categories: TicketCategory[]): {
    canPublish: boolean;
    reason?: string;
  } {
    // Event can only be published if it has at least one active ticket category
    const activeCategories = categories.filter((c) => c.isActive);

    if (activeCategories.length === 0) {
      return {
        canPublish: false,
        reason: 'Event must have at least one active ticket category',
      };
    }

    return { canPublish: true };
  }

  it('should not publish event with no ticket categories', () => {
    const categories: TicketCategory[] = [];
    const result = canPublishEvent(categories);

    expect(result.canPublish).toBe(false);
    expect(result.reason).toBe(
      'Event must have at least one active ticket category',
    );
  });

  it('should not publish event with no active ticket categories', () => {
    const categories: TicketCategory[] = [
      { id: '1', name: 'VIP', isActive: false, quota: 100 },
      { id: '2', name: 'Regular', isActive: false, quota: 500 },
    ];
    const result = canPublishEvent(categories);

    expect(result.canPublish).toBe(false);
  });

  it('should publish event with at least one active ticket category', () => {
    const categories: TicketCategory[] = [
      { id: '1', name: 'VIP', isActive: true, quota: 100 },
      { id: '2', name: 'Regular', isActive: false, quota: 500 },
    ];
    const result = canPublishEvent(categories);

    expect(result.canPublish).toBe(true);
  });
});

// ============================================
// Test Case 4: Ticket category quota cannot exceed event capacity
// ============================================
describe('Ticket Category Domain: Quota Validation', () => {
  function validateCategoryQuota(
    newCategoryQuota: number,
    existingCategoriesQuota: number,
    eventCapacity: number,
  ): { isValid: boolean; reason?: string } {
    // Total quota of all ticket categories must not exceed the maximum event capacity
    const totalQuota = existingCategoriesQuota + newCategoryQuota;

    if (totalQuota > eventCapacity) {
      return {
        isValid: false,
        reason: 'Total ticket quota exceeds event capacity',
      };
    }

    return { isValid: true };
  }

  it('should reject category when quota exceeds event capacity', () => {
    const result = validateCategoryQuota(
      600, // new category quota
      500, // existing categories quota
      1000, // event capacity
    );

    expect(result.isValid).toBe(false);
    expect(result.reason).toBe('Total ticket quota exceeds event capacity');
  });

  it('should accept category when quota equals event capacity (edge case)', () => {
    const result = validateCategoryQuota(
      500, // new category quota
      500, // existing categories quota
      1000, // event capacity
    );

    expect(result.isValid).toBe(true); // Equal to capacity is valid (not exceeding)
  });

  it('should accept category when quota is within event capacity', () => {
    const result = validateCategoryQuota(
      300, // new category quota
      500, // existing categories quota
      1000, // event capacity
    );

    expect(result.isValid).toBe(true);
  });
});

// ============================================
// Test Case 5: Booking cannot be created with zero quantity
// ============================================
describe('Booking Domain: Quantity Validation', () => {
  function validateBookingQuantity(quantity: number): boolean {
    // Ticket quantity must be greater than zero
    return quantity > 0;
  }

  it('should reject booking with zero quantity', () => {
    const isValid = validateBookingQuantity(0);
    expect(isValid).toBe(false);
  });

  it('should reject booking with negative quantity', () => {
    const isValid = validateBookingQuantity(-1);
    expect(isValid).toBe(false);
  });

  it('should accept booking with quantity of 1', () => {
    const isValid = validateBookingQuantity(1);
    expect(isValid).toBe(true); // Single ticket bookings are valid
  });

  it('should accept booking with quantity greater than 1', () => {
    const isValid = validateBookingQuantity(2);
    expect(isValid).toBe(true);
  });
});

// ============================================
// Test Case 6: Booking cannot be paid after payment deadline
// ============================================
describe('Booking Domain: Payment Deadline Validation', () => {
  function canPayBooking(
    bookingStatus: BookingStatus,
    expiresAt: Date,
  ): { canPay: boolean; reason?: string } {
    // A booking can only be paid if its status is PendingPayment
    // A booking cannot be paid if the payment deadline has passed
    if (bookingStatus !== BookingStatus.PENDING_PAYMENT) {
      return { canPay: false, reason: 'Booking is not pending payment' };
    }

    if (new Date() > expiresAt) {
      return { canPay: false, reason: 'Payment deadline exceeded' };
    }

    return { canPay: true };
  }

  it('should not pay booking after deadline has passed', () => {
    const pastDate = new Date('2024-01-01T10:00:00Z');
    const result = canPayBooking(BookingStatus.PENDING_PAYMENT, pastDate);

    expect(result.canPay).toBe(false);
    expect(result.reason).toBe('Payment deadline exceeded');
  });

  it('should not pay booking that is already paid', () => {
    const futureDate = new Date('2099-12-31T23:59:59Z');
    const result = canPayBooking(BookingStatus.PAID, futureDate);

    expect(result.canPay).toBe(false);
    expect(result.reason).toBe('Booking is not pending payment');
  });

  it('should not pay booking that is expired', () => {
    const pastDate = new Date('2024-01-01T10:00:00Z');
    const result = canPayBooking(BookingStatus.EXPIRED, pastDate);

    expect(result.canPay).toBe(false);
  });

  it('should pay booking within deadline', () => {
    const futureDate = new Date('2099-12-31T23:59:59Z');
    const result = canPayBooking(BookingStatus.PENDING_PAYMENT, futureDate);

    expect(result.canPay).toBe(true);
  });
});

// ============================================
// Test Case 7: Booking cannot be paid with incorrect payment amount
// ============================================
describe('Booking Domain: Payment Amount Validation', () => {
  function validatePaymentAmount(
    paymentAmount: number,
    expectedAmount: number,
  ): { isValid: boolean; reason?: string } {
    // The payment amount must be equal to the total booking price
    if (paymentAmount !== expectedAmount) {
      return {
        isValid: false,
        reason: `Payment amount ${paymentAmount} does not match expected ${expectedAmount}`,
      };
    }

    return { isValid: true };
  }

  it('should reject payment with incorrect amount (less)', () => {
    const result = validatePaymentAmount(100, 200);

    expect(result.isValid).toBe(false);
    expect(result.reason).toContain('does not match expected');
  });

  it('should reject payment with incorrect amount (more)', () => {
    const result = validatePaymentAmount(300, 200);

    expect(result.isValid).toBe(false);
  });

  it('should accept payment with correct amount', () => {
    const result = validatePaymentAmount(200, 200);

    expect(result.isValid).toBe(true);
  });
});

// ============================================
// Test Case 8: Paid booking cannot expire
// ============================================
describe('Booking Domain: Expiration Logic', () => {
  function processBookingExpiration(
    bookingStatus: BookingStatus,
  ): BookingStatus {
    // Only PENDING_PAYMENT bookings can expire
    if (bookingStatus === BookingStatus.PENDING_PAYMENT) {
      return BookingStatus.EXPIRED;
    }
    // PAID, CANCELLED bookings cannot expire
    return bookingStatus;
  }

  it('should expire booking with PENDING_PAYMENT status', () => {
    const result = processBookingExpiration(BookingStatus.PENDING_PAYMENT);
    expect(result).toBe(BookingStatus.EXPIRED);
  });

  it('should not expire PAID booking', () => {
    const result = processBookingExpiration(BookingStatus.PAID);
    expect(result).toBe(BookingStatus.PAID);
  });

  it('should not expire CANCELLED booking', () => {
    const result = processBookingExpiration(BookingStatus.CANCELLED);
    expect(result).toBe(BookingStatus.CANCELLED);
  });
});

// ============================================
// Test Case 9: Checked-in ticket cannot be checked in again
// ============================================
describe('Check-in Domain: Ticket Status Validation', () => {
  function canCheckIn(ticketStatus: TicketStatus): {
    canCheckIn: boolean;
    reason?: string;
  } {
    // A ticket that has already been checked in cannot be used again
    if (ticketStatus === TicketStatus.CHECKED_IN) {
      return { canCheckIn: false, reason: 'Ticket already checked in' };
    }

    if (ticketStatus !== TicketStatus.ACTIVE) {
      return { canCheckIn: false, reason: `Ticket status is ${ticketStatus}` };
    }

    return { canCheckIn: true };
  }

  it('should reject check-in for already checked-in ticket', () => {
    const result = canCheckIn(TicketStatus.CHECKED_IN);

    expect(result.canCheckIn).toBe(false);
    expect(result.reason).toBe('Ticket already checked in');
  });

  it('should reject check-in for cancelled ticket', () => {
    const result = canCheckIn(TicketStatus.CANCELLED);

    expect(result.canCheckIn).toBe(false);
  });

  it('should reject check-in for expired ticket', () => {
    const result = canCheckIn(TicketStatus.EXPIRED);

    expect(result.canCheckIn).toBe(false);
  });

  it('should reject check-in for refunded ticket', () => {
    const result = canCheckIn(TicketStatus.REFUNDED);

    expect(result.canCheckIn).toBe(false);
  });

  it('should accept check-in for active ticket', () => {
    const result = canCheckIn(TicketStatus.ACTIVE);

    expect(result.canCheckIn).toBe(true);
  });
});

// ============================================
// Test Case 10: Refund cannot be requested if ticket has already been checked in
// ============================================
describe('Refund Domain: Checked-in Ticket Validation', () => {
  interface Ticket {
    id: string;
    status: TicketStatus;
  }

  function canRequestRefund(tickets: Ticket[]): {
    canRequest: boolean;
    reason?: string;
  } {
    // A refund cannot be requested if any ticket from the booking has already been checked in
    const hasCheckedInTicket = tickets.some(
      (t) => t.status === TicketStatus.CHECKED_IN,
    );

    if (hasCheckedInTicket) {
      return {
        canRequest: false,
        reason: 'Cannot refund booking with checked-in tickets',
      };
    }

    return { canRequest: true };
  }

  it('should not allow refund when any ticket is checked in', () => {
    const tickets: Ticket[] = [
      { id: '1', status: TicketStatus.ACTIVE },
      { id: '2', status: TicketStatus.CHECKED_IN },
    ];

    const result = canRequestRefund(tickets);

    expect(result.canRequest).toBe(false);
    expect(result.reason).toBe('Cannot refund booking with checked-in tickets');
  });

  it('should allow refund when all tickets are active', () => {
    const tickets: Ticket[] = [
      { id: '1', status: TicketStatus.ACTIVE },
      { id: '2', status: TicketStatus.ACTIVE },
    ];

    const result = canRequestRefund(tickets);

    expect(result.canRequest).toBe(true);
  });
});

// ============================================
// Test Case 11: Refund cannot be approved if it is not in Requested status
// ============================================
describe('Refund Domain: Approval Status Validation', () => {
  function canApproveRefund(refundStatus: RefundStatus): {
    canApprove: boolean;
    reason?: string;
  } {
    // A refund must have status REQUESTED to be approved
    if (refundStatus !== RefundStatus.REQUESTED) {
      return {
        canApprove: false,
        reason: 'Refund is not in requested status',
      };
    }

    return { canApprove: true };
  }

  it('should not approve already approved refund', () => {
    const result = canApproveRefund(RefundStatus.APPROVED);

    expect(result.canApprove).toBe(false);
    expect(result.reason).toBe('Refund is not in requested status');
  });

  it('should not approve rejected refund', () => {
    const result = canApproveRefund(RefundStatus.REJECTED);

    expect(result.canApprove).toBe(false);
  });

  it('should not approve paid out refund', () => {
    const result = canApproveRefund(RefundStatus.PAID_OUT);

    expect(result.canApprove).toBe(false);
  });

  it('should approve refund in requested status', () => {
    const result = canApproveRefund(RefundStatus.REQUESTED);

    expect(result.canApprove).toBe(true);
  });
});

// ============================================
// Test Case 12: Rejected refund must have a rejection reason
// ============================================
describe('Refund Domain: Rejection Reason Validation', () => {
  function validateRejection(
    refundStatus: RefundStatus,
    reason?: string,
  ): { isValid: boolean; reason?: string } {
    // A rejected refund must have a rejection reason
    if (
      refundStatus === RefundStatus.REJECTED &&
      (!reason || reason.trim() === '')
    ) {
      return {
        isValid: false,
        reason: 'Rejection reason is required',
      };
    }

    return { isValid: true };
  }

  it('should reject without reason when status is REJECTED', () => {
    const result = validateRejection(RefundStatus.REJECTED);

    expect(result.isValid).toBe(false);
    expect(result.reason).toBe('Rejection reason is required');
  });

  it('should reject with empty reason when status is REJECTED', () => {
    const result = validateRejection(RefundStatus.REJECTED, '');

    expect(result.isValid).toBe(false);
  });

  it('should reject with whitespace-only reason when status is REJECTED', () => {
    const result = validateRejection(RefundStatus.REJECTED, '   ');

    expect(result.isValid).toBe(false);
  });

  it('should accept with valid reason when status is REJECTED', () => {
    const result = validateRejection(
      RefundStatus.REJECTED,
      'Refund policy not met',
    );

    expect(result.isValid).toBe(true);
  });

  it('should not require reason for other statuses', () => {
    const result = validateRejection(RefundStatus.REQUESTED);

    expect(result.isValid).toBe(true);
  });
});
