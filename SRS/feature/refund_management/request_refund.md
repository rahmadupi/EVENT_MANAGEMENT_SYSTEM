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

### Note
When a Customer decides to request a refund, the system must ensure that their booking meets the necessary criteria for a refund request. This includes having a booking status of Paid, ensuring that no tickets from the booking have been checked in, and submitting the refund request before the specified refund deadline. If the event associated with the booking is cancelled, the system will automatically allow a refund request without requiring the Customer to initiate it. Once a refund request is submitted, its status is set to Requested, and the system raises a domain event to notify other parts of the system about the new refund request, allowing for further processing by Event Organizers or System Admins. This process helps ensure that customers can easily request refunds while maintaining clear rules and procedures for handling such requests.