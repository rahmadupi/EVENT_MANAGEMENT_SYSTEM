# EVENT MANAGEMENT SYSTEM - PROJECT OVERVIEW

The Event Management System is designed to facilitate the organization and management of events, including ticket sales, participant management, and event monitoring. The system provides a platform for event organizers to create and manage events, while allowing customers to browse and book tickets for various events. Additionally, gate officers can validate tickets during events, and system administrators can oversee operational processes.

## System Context

The system interacts with several external actors and external systems.
Human Actors:
Event Organizer
The Event Organizer can:
• create events
• manage ticket categories
• publish or cancel events
• approve or reject refund requests
• view sales reports
• view participant lists
Customer
The Customer can:
• browse available events
• view event details
• create ticket bookings
• pay for bookings
• view purchased tickets
• request refunds
Gate Officer
The Gate Officer can:
• validate ticket codes
• check in participants during an event
System Admin
The System Admin can:
3
• trigger refund payout
• monitor operational processes


### External Systems

The system may interact with:

1. Payment Gateway. Used to process booking payments.
2. Refund Payment Service / Bank Service. Used to process refund payout to
   customers.
3. Notification Service. Used to send email or WhatsApp notifications.
   These external systems must be accessed through application service interfaces defined in
   the application layer. Their actual implementations must be placed in the infrastructure
   layer.
