# Expire Booking

### User Story

As the System, I can mark unpaid bookings as expired after their payment deadline so that
reserved ticket quota can be released.

### Acceptance Criteria

• A booking with the status PendingPayment changes to Expired after its payment
deadline has passed.
• A booking with the status Paid cannot be marked as expired.
• When a booking expires, the previously reserved ticket quota is released.
• After a booking expires, the system raises the domain event BookingExpired.

### Business Rules

### Details
