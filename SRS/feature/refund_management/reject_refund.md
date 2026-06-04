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

### Note
When an Event Organizer receives a refund request, they must evaluate the validity of the request based on the provided information and the circumstances of the booking. If the refund request is deemed invalid, the Event Organizer can reject the request by providing a reason for the rejection. This action updates the status of the refund request to Rejected, while the associated booking remains in the Paid status, and any related tickets that have not been cancelled remain Active. The system also raises a domain event to notify other parts of the system about the change in refund status, ensuring that all relevant stakeholders are informed of the rejection. This helps maintain the integrity of the refund process and ensures that only valid refund requests are processed.