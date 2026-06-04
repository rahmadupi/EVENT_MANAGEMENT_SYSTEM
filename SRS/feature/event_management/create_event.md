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

### Note

When an Event Organizer creates a new event, they must provide essential information such as the event name, description, start and end dates, location, and maximum capacity. The system enforces business rules to ensure that the end date is not earlier than the start date and that the maximum capacity is a positive number. Once the event is successfully created, it is assigned the status Draft, indicating that it is not yet available for customers to view or purchase tickets. The system also raises a domain event to notify other parts of the system about the new event, allowing for any necessary updates or actions to be taken in response to its creation. This process helps Event Organizers set up their events effectively while ensuring that all necessary information is provided and validated before the event becomes available to customers.
