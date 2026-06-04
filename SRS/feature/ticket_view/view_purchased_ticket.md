# View Purchased Ticket

### User Story

As a Customer, I can view my purchased tickets so that I can use them to enter the event.

### Acceptance Criteria

• Customers can only view tickets from bookings with the status Paid.
• Each ticket must have a unique ticket code.
• Each ticket must have one of the following statuses: Active, CheckedIn, or
Cancelled.
• Tickets from cancelled events must have the status Cancelled or RefundRequired

### Business Rules

### Details

### Note
When a Customer views their purchased tickets, the system retrieves and displays only those tickets that are associated with bookings that have been paid for. Each ticket is identified by a unique ticket code and is assigned a status that indicates its current state, such as Active for valid tickets, CheckedIn for tickets that have been used for entry, and Cancelled for tickets that are no longer valid due to event cancellation. If an event has been cancelled, the associated tickets will either be marked as Cancelled or RefundRequired, depending on the refund policy and the status of the booking. This allows Customers to easily identify the status of their tickets and take appropriate actions, such as requesting a refund if necessary.