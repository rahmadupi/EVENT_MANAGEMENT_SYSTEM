# Create

### User Story

As a Customer, I can create a ticket booking so that I can reserve tickets before making
payment.

### Acceptance Criteria

• Customers can select an event, ticket category, and ticket quantity.
• A booking can only be created for an event with the status Published.
• A booking can only be created for an active ticket category.
• A booking can only be created within the ticket sales period.
• The ticket quantity must be greater than zero.
• The ticket quantity must not exceed the remaining ticket quota.
• A customer cannot have more than one active booking for the same event.
• A newly created booking must have the status PendingPayment.
• A booking must have a payment deadline, for example 15 minutes after it is created.
• After a booking is created, the system raises the domain event TicketReserved.

### Details

### Note

When a Customer creates a ticket booking, the system validates the input to ensure that the event is published, the ticket category is active, and that the booking is made within the ticket sales period. The system also checks that the requested ticket quantity is greater than zero and does not exceed the remaining ticket quota for that category. Additionally, the system ensures that the customer does not already have an active booking for the same event. If all conditions are met, a new booking is created with the status PendingPayment, and a payment deadline is set (e.g., 15 minutes from creation). The system then raises a domain event to notify other parts of the system about the new booking, allowing for any necessary updates or actions to be taken in response to the booking creation. This process helps ensure that customers can easily reserve tickets while maintaining clear rules and procedures for handling bookings.
