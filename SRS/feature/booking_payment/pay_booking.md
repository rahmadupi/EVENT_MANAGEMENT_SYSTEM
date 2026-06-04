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

### Note

When a Customer initiates the payment process for their booking, the system first checks to ensure that the booking is in the correct status (PendingPayment) and that the payment deadline has not yet passed. The system also verifies that the payment amount matches the total price of the booking. If all conditions are met and the payment is successful, the system updates the booking status to Paid, raises a domain event to notify other parts of the system about the successful payment, and issues tickets associated with the booking. Each ticket is assigned a unique ticket code, which can be used for check-in and other ticket-related processes. This ensures that customers have a seamless experience when confirming their bookings and receiving their tickets.
