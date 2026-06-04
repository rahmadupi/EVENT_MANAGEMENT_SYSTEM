# Reject Refund

### User Story

As an Event Organizer, I can reject a refund request so that invalid refund requests are not
processed.

### Acceptance Criteria

• A refund can only be rejected if its status is Requested.
• A rejection reason must be provided.
• When a refund is rejected, its status changes to Rejected.
• The related booking remains Paid.
• Related tickets remain Active if they have not been cancelled.
• After a refund is rejected, the system raises the domain event RefundRejected.

### Business Rules

### Details
