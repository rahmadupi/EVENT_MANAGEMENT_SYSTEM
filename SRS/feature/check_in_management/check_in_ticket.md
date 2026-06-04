# Check-in Ticket

# User Story

As a Gate Officer, I can check in a ticket so that the participant can enter the event venue.

### Acceptance Criteria

• Check-in can only be performed for the event that matches the ticket.
• The ticket must have the status Active.
• A ticket that has already been checked in cannot be used again.
• Check-in can only be performed on the event day or within the allowed check-in
time window.
• After successful check-in, the ticket status changes to CheckedIn.
• After the ticket is checked in, the system raises the domain event TicketCheckedIn

### Details

### Note

When a Gate Officer checks in a ticket, the system validates the ticket against several criteria to ensure its validity. The ticket must be active, must not have been checked in before, and must correspond to the correct event. Additionally, check-in can only occur on the event day or within a specified check-in time window. If the check-in is successful, the ticket's status is updated to CheckedIn, and a domain event is raised to notify other parts of the system about the check-in, allowing for any necessary updates or actions to be taken in response to the check-in. This process helps maintain the integrity of the check-in system and ensures that only valid tickets are processed for entry into the event venue.
