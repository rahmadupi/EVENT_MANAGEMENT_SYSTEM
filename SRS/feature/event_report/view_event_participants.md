# View Event Participants

### User Story

As an Event Organizer, I can view the participant list so that I can know who is expected to
attend the event.

### Acceptance Criteria

• The participant list only displays customers from bookings with the status Paid.
• Participants from refunded bookings are not displayed as active participants.
• The participant data includes customer name, ticket category, ticket code, and
check-in status.
• The participant list must be retrieved through a query in the application layer.

### Bussiness Rules

### Details

### Note
The participant list is generated based on the booking data. Only bookings that have been paid for are considered valid and included in the participant list. If a booking has been refunded, the associated participants are removed from the active participant list, ensuring that only those who have completed their payment are counted as participants for the event.