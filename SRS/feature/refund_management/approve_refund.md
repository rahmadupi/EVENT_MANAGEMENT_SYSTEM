# Approve Refund

### User Story

As an Event Organizer, I can approve a refund request so that the customer can receive the
refund payment.

### Acceptance Criteria

• A refund can only be approved if its status is Requested.
• When a refund is approved, its status changes to Approved.
• Related tickets are changed to Cancelled.
• The related booking is changed to Refunded.
• After a refund is approved, the system raises the domain event RefundApproved.

### Business Rules

### Details
