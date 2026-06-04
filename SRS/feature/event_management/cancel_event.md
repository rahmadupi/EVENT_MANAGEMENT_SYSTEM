# Cancel Event

### User Story

As an Event Organizer, I can cancel an event so that ticket sales are stopped.

### Acceptance Criteria

• An event with the status Published can be cancelled.
• An event with the status Completed cannot be cancelled.
• When an event is cancelled, all ticket categories can no longer be purchased.
• Paid bookings must be marked as requiring a refund.
• After the event is cancelled, the system raises the domain event EventCancelled.

### Details

