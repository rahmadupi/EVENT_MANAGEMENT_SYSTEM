# Pay Booking

### User Story

As a Customer, I can pay for my booking so that my tickets are confirmed.

### Acceptance Criteria

• A booking can only be paid if its status is PendingPayment.
• A booking cannot be paid if the payment deadline has passed.
7
• The payment amount must be equal to the total booking price.
• After payment is successful, the booking status changes to Paid.
• After the booking is paid, the system raises the domain event BookingPaid.
• After the booking is paid, the system issues tickets with unique ticket codes.

### Business Rules

### Details
