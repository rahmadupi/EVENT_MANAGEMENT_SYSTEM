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

