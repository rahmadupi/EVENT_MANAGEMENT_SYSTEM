# Create Event

### User Story

As an Event Organizer, I can create a new event so that tickets can be sold to customers.

### Acceptance Criteria

• Given I am authenticated as an Event Organizer, when I enter the event name,
description, start date, end date, location, and maximum capacity, then the event is
created successfully.
• The event cannot be created if the end date is earlier than the start date.
• The event cannot be created if the maximum capacity is less than or equal to zero.
• A newly created event must have the status Draft.
• After the event is created, the system raises the domain event EventCreated.

### Details
