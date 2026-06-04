# Publish Event

### User Story

As an Event Organizer, I can publish an event so that customers can view the event and
purchase tickets.

### Acceptance Criteria

• An event can only be published if it has at least one active ticket category.
4
• An event can only be published if the total ticket quota does not exceed the
maximum event capacity.
• An event with the status Draft can be changed to Published.
• An event with the status Cancelled cannot be published.
• After the event is published, the system raises the domain event EventPublished.

### Details

### Note

When an Event Organizer decides to publish an event, the system first checks to ensure that the event has at least one active ticket category and that the total ticket quota does not exceed the maximum capacity of the event. If these conditions are met, the system allows the Event Organizer to change the status of the event from Draft to Published. Once published, customers can view the event details and purchase tickets. The system also raises a domain event to notify other parts of the system about the change in event status, enabling any necessary updates or actions to be taken in response to the published event. This process helps ensure that events are properly prepared before being made available to customers, providing a smooth experience for both Event Organizers and customers.
