
# Reject Invalid Ticket

### User Story

As a Gate Officer, I can identify invalid tickets so that fake or duplicate tickets can be
rejected.

### Acceptance Criteria

• If the ticket code is not found, the system displays a message that the ticket is
invalid.
• If the ticket has already been checked in, the system displays a message that the
ticket has already been used.
• If the ticket belongs to a different event, the system displays a message that the
ticket does not match the event.
• If the event has been cancelled, the system displays a message that the event has
been cancelled.
• The ticket status must not change if check-in fails.

### Business Rules

### Details

### Note
When a Gate Officer attempts to check in a ticket, the system performs several validations to ensure the ticket's validity. If any of the validation checks fail, such as the ticket code not being found, the ticket having already been checked in, the ticket belonging to a different event, or the event being cancelled, the system provides appropriate feedback messages to inform the Gate Officer of the issue. Importantly, if any of these checks fail, the status of the ticket remains unchanged, ensuring that invalid tickets are not processed and that the integrity of the check-in process is maintained.

might add expired status on ticket