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

### Note
The process of marking a refund as paid out is the final step in the refund management workflow. Once a refund request has been approved, the System Admin can trigger the payout process. This involves recording a payment reference, which could be an identifier from the refund payment service or bank service used to process the refund. After the refund is marked as paid out, its status is updated to reflect that the refund has been completed, and the system raises a domain event to notify other parts of the system about the change in refund status. This ensures that the refund lifecycle is properly managed and that all relevant stakeholders are informed of the refund's completion.