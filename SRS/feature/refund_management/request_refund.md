# Request Refund

# User Story 

As a Customer, I can request a refund so that I can receive my money back according to
the refund policy.

### Acceptance Criteria

• A refund can only be requested for a booking with the status Paid.
• A refund cannot be requested if any ticket from the booking has already been
checked in.
• A refund can only be requested before the refund deadline.
• If the event is cancelled, a refund is automatically allowed.
• A refund must have one of the following statuses: Requested, Approved, Rejected,
or PaidOut.
• After a refund is requested, the system raises the domain event RefundRequested.

### Business Rules

### Details
