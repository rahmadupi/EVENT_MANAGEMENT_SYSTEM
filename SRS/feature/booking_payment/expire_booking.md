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

### Note
The process of expiring bookings is an automated function of the system that ensures that reserved ticket quotas are efficiently managed. When a booking is created with the status PendingPayment, it holds a reservation for a certain number of tickets. If the customer fails to complete the payment within the specified deadline, the system automatically updates the booking status to Expired. This action releases the reserved ticket quota back into the available pool, allowing other customers to purchase those tickets. The system also raises a domain event to notify other parts of the system about the change in booking status, enabling any necessary updates or actions to be taken in response to the expired booking. This mechanism helps maintain the availability of tickets and ensures that the booking process is fair and efficient for all customers.