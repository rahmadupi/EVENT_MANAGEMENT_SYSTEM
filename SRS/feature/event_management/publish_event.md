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

