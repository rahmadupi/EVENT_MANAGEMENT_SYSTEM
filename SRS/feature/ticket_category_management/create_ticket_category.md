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

### Note

When an Event Organizer creates a ticket category, they must provide essential information such as the name of the category, its price, the number of tickets available (quota), and the sales period (start and end dates). The system enforces business rules to ensure that the ticket price is not negative, the quota is a positive number, and that the sales period is valid in relation to the event start date. Additionally, the system checks that the total quota across all ticket categories does not exceed the maximum capacity of the event. Once a ticket category is successfully created, the system raises a domain event to notify other parts of the system about the new ticket category, allowing for any necessary updates or actions to be taken in response to its creation. This process helps Event Organizers manage their ticket offerings effectively while ensuring a smooth experience for customers when selecting tickets for purchase.
