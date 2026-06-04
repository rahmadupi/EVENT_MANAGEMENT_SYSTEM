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

### Note

When an Event Organizer decides to disable a ticket category, the system first checks to ensure that the event associated with the ticket category has not yet been completed. If the event is still active, the system allows the Event Organizer to disable the ticket category. Once disabled, customers will no longer be able to purchase tickets from that category, but any existing bookings for that category will still be retained in the system for historical reference. The system also raises a domain event to notify other parts of the system about the change in ticket category status, allowing for any necessary updates or actions to be taken in response to the disabled ticket category. This process helps Event Organizers manage their ticket offerings while maintaining accurate records of past bookings.
