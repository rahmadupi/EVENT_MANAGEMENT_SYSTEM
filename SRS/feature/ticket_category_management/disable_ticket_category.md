# disable ticket category

### User Story

As an Event Organizer, I can disable a ticket category so that customers can no longer
purchase tickets from that category.

### Acceptance Criteria

• A ticket category can be disabled if the event has not been completed.
• A ticket category that already has bookings must still be stored for historical
purposes.
• Customers cannot purchase tickets from an inactive ticket category.
• After a ticket category is disabled, the system raises the domain event
TicketCategoryDisabled.

### Details
