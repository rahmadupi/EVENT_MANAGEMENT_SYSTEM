# Create Ticket Category

### User Story

As an Event Organizer, I can create ticket categories so that customers can choose from
different types of tickets.

### Acceptance Criteria

• The Event Organizer can create ticket categories such as Regular, VIP, or Early Bird.
• Each ticket category must have a name, price, quota, sales start date, and sales
end date.
• The ticket price cannot be less than zero.
• The ticket quota must be greater than zero.
• The ticket sales period must end before or at the event start date.
• The total quota of all ticket categories must not exceed the maximum event
capacity.
• After a ticket category is created, the system raises the domain event
TicketCategoryCreated.

### Details
