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

### Note

When an Event Organizer decides to cancel an event, the system first checks to ensure that the event is currently in the Published status, as events that have already been completed cannot be cancelled. Once the event is cancelled, the system updates the status of all associated ticket categories to prevent any further purchases. Additionally, any bookings that have already been paid for are marked as requiring a refund, allowing customers to request refunds for their purchases. The system also raises a domain event to notify other parts of the system about the cancellation, enabling any necessary updates or actions to be taken in response to the cancelled event. This process helps maintain clear communication with customers and ensures that the cancellation is handled efficiently and effectively.
