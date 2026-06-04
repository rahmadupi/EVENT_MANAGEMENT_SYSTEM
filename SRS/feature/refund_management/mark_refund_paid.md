# Mark Refund as Paid Out

### User Story

As a System/Admin, I can mark an approved refund as paid out so that the refund process
is completed.

### Acceptance Criteria

• A refund can only be marked as paid out if its status is Approved.
• A payment reference must be recorded.
• When the refund is paid out, its status changes to PaidOut.
• A paid-out refund cannot be approved, rejected, or cancelled again.
• After the refund is paid out, the system raises the domain event RefundPaidOut

### Business Rules

### Details
