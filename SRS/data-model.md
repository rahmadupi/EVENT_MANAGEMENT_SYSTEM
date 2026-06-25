# Data Model

This document describes the data model for the Event Management System based on the feature specifications.

---

## Entity Relationship Diagram

```
┌──────────┐       ┌──────────────┐       ┌─────────┐
│   User   │──┐    │    Event    │──┐    │  Event  │
└──────────┘  │    └──────────────┘  │    │ Status │
              │    │ id              │    │ Enum   │
              │    │ name           │    └───────┘
              │    │ description   │
              │    │ startDate    │       ┌────────────────┐
              │    │ endDate      │◄─────┤TicketCategory │
              │    │ location     │       └────────────────┤
              │    │ maxCapacity  │       │ id             │
              │    │ status      │       │ eventId        │
              │    │ createdBy   │       │ name           │
              │    │ createdAt   │       │ price          │
              │    │ updatedAt   │       │ quota          │
              └──────────────┘       │ salesStartDate │
                                   │ salesEndDate  │
              ┌────────────────┐   │ isActive      │
              │    Booking     │   └────────────────┘
              └────────────────┤
              │ id             │
              │ userId         │       ┌───────────┐
              │ eventId        │◄──────│  Ticket  │
              │ status        │       └───────────┤
              │ totalPrice    │       │ id        │
              │ paymentDue   │       │ bookingId │
              │ paidAt      │       │ eventId   │
              │ expiresAt    │       │ categoryId│
              │ createdAt    │       │ code     │
              │ updatedAt    │       │ status   │
              └──────────────┘       │ checkedInAt │
                                   │ createdAt  │
              ┌────────────────┐    │ updatedAt │
              │    Refund     │    └───────────┘
              └────────────────┤
              │ id             │
              │ userId         │
              │ bookingId      │
              │ amount        │
              │ status        │
              │ requestedAt   │
              │ processedAt   │
              │ createdAt     │
              │ updatedAt     │
              └───────────────┘
```

---

## Enums

### EventStatus

| Value       | Description                        |
| ----------- | ---------------------------------- |
| `DRAFT`     | Event is created but not published |
| `PUBLISHED` | Event is visible to customers      |
| `CANCELLED` | Event has been cancelled           |

### BookingStatus

| Value             | Description                 |
| ----------------- | --------------------------- |
| `PENDING_PAYMENT` | Waiting for customer to pay |
| `PAID`            | Payment completed           |
| `EXPIRED`         | Payment deadline passed     |
| `CANCELLED`       | Booking cancelled           |

### TicketStatus

| Value        | Description          |
| ------------ | -------------------- |
| `ACTIVE`     | Ticket is valid      |
| `CHECKED_IN` | Ticket has been used |
| `CANCELLED`  | Ticket cancelled     |
| `EXPIRED`    | Ticket expired       |
| `REFUNDED`   | Ticket refunded      |

### RefundStatus

| Value       | Description                  |
| ----------- | ---------------------------- |
| `REQUESTED` | Refund requested by customer |
| `APPROVED`  | Refund approved by organizer |
| `REJECTED`  | Refund rejected by organizer |
| `PAID_OUT`  | Refund payout completed      |

### UserRole

| Value             | Description                  |
| ----------------- | ---------------------------- |
| `EVENT_ORGANIZER` | Can create and manage events |
| `CUSTOMER`        | Can browse and book tickets  |
| `GATE_OFFICER`    | Can validate tickets         |
| `SYSTEM_ADMIN`    | Can manage system operations |

---

## Entities

### User

| Field       | Type     | Constraints      |
| ----------- | -------- | ---------------- |
| `id`        | UUID     | PK               |
| `email`     | String   | Unique, Not Null |
| `password`  | String   | Not Null         |
| `name`      | String   | Not Null         |
| `role`      | UserRole | Not Null         |
| `createdAt` | DateTime | Not Null         |
| `updatedAt` | DateTime | Not Null         |

### Event

| Field         | Type        | Constraints              |
| ------------- | ----------- | ------------------------ |
| `id`          | UUID        | PK                       |
| `name`        | String      | Not Null                 |
| `description` | Text        | Nullable                 |
| `startDate`   | DateTime    | Not Null                 |
| `endDate`     | DateTime    | Not Null                 |
| `location`    | String      | Not Null                 |
| `maxCapacity` | Integer     | Not Null, > 0            |
| `status`      | EventStatus | Not Null, Default: DRAFT |
| `createdBy`   | UUID        | FK → User.id             |
| `createdAt`   | DateTime    | Not Null                 |
| `updatedAt`   | DateTime    | Not Null                 |

**Validation Rules:**

- `endDate` must be >= `startDate`
- `maxCapacity` must be > 0

### TicketCategory

| Field            | Type         | Constraints                   |
| ---------------- | ------------ | ----------------------------- |
| `id`             | UUID         | PK                            |
| `eventId`        | UUID         | FK → Event.id, Not Null       |
| `name`           | String       | Not Null                      |
| `price`          | Decimal      | Not Null, >= 0                |
| `quota`          | Integer      | Not Null, > 0                 |
| `salesStartDate` | DateTime     | Not Null                      |
| `salesEndDate`   | DateTime     | Not Null                      |
| `isActive`       | Boolean      | Not Null, Default: true       |
| `refundPolicy`   | RefundPolicy | Not Null, Default: REFUNDABLE |
| `createdAt`      | DateTime     | Not Null                      |
| `updatedAt`      | DateTime     | Not Null                      |

**Validation Rules:**

- `salesEndDate` must be <= `event.startDate`
- Total quota of all categories <= `event.maxCapacity`

### Booking

| Field        | Type          | Constraints                        |
| ------------ | ------------- | ---------------------------------- |
| `id`         | UUID          | PK                                 |
| `userId`     | UUID          | FK → User.id, Not Null             |
| `eventId`    | UUID          | FK → Event.id, Not Null            |
| `status`     | BookingStatus | Not Null, Default: PENDING_PAYMENT |
| `totalPrice` | Decimal       | Not Null                           |
| `paymentDue` | Decimal       | Not Null                           |
| `paidAt`     | DateTime      | Nullable                           |
| `expiresAt`  | DateTime      | Not Null                           |
| `createdAt`  | DateTime      | Not Null                           |
| `updatedAt`  | DateTime      | Not Null                           |

**Relationships:**

- One User → Many Bookings
- One Event → Many Bookings
- One Booking → Many Tickets
- One Booking → Many Refunds

### BookingItem (Junction for multi-ticket booking)

| Field              | Type    | Constraints                      |
| ------------------ | ------- | -------------------------------- |
| `id`               | UUID    | PK                               |
| `bookingId`        | UUID    | FK → Booking.id, Not Null        |
| `ticketCategoryId` | UUID    | FK → TicketCategory.id, Not Null |
| `quantity`         | Integer | Not Null, > 0                    |
| `unitPrice`        | Decimal | Not Null                         |
| `subtotal`         | Decimal | Not Null                         |

### Ticket

| Field         | Type         | Constraints                      |
| ------------- | ------------ | -------------------------------- |
| `id`          | UUID         | PK                               |
| `bookingId`   | UUID         | FK → Booking.id, Not Null        |
| `eventId`     | UUID         | FK → Event.id, Not Null          |
| `categoryId`  | UUID         | FK → TicketCategory.id, Not Null |
| `code`        | String       | Unique, Not Null                 |
| `status`      | TicketStatus | Not Null, Default: ACTIVE        |
| `checkedInAt` | DateTime     | Nullable                         |
| `createdAt`   | DateTime     | Not Null                         |
| `updatedAt`   | DateTime     | Not Null                         |

**Ticket Code Generation:**

- Format: `EVT-{EVENT_ID_6CHARS}-{RANDOM_8CHARS}`
- Example: `EVT-A1B2C3-D4E5F6G7`

### Refund

| Field         | Type         | Constraints                  |
| ------------- | ------------ | ---------------------------- |
| `id`          | UUID         | PK                           |
| `userId`      | UUID         | FK → User.id, Not Null       |
| `bookingId`   | UUID         | FK → Booking.id, Not Null    |
| `amount`      | Decimal      | Not Null                     |
| `status`      | RefundStatus | Not Null, Default: REQUESTED |
| `reason`      | Text         | Nullable                     |
| `requestedAt` | DateTime     | Not Null                     |
| `processedAt` | DateTime     | Nullable                     |
| `createdAt`   | DateTime     | Not Null                     |
| `updatedAt`   | DateTime     | Not Null                     |

### AuditLog

| Field         | Type     | Constraints  |
| ------------- | -------- | ------------ |
| `id`          | UUID     | PK           |
| `entityType`  | String   | Not Null     |
| `entityId`    | UUID     | Not Null     |
| `action`      | String   | Not Null     |
| `performedBy` | UUID     | FK → User.id |
| `oldValue`    | JSON     | Nullable     |
| `newValue`    | JSON     | Nullable     |
| `createdAt`   | DateTime | Not Null     |

---

## Indexes

| Table            | Index                | Fields    |
| ---------------- | -------------------- | --------- |
| `Event`          | idx_event_status     | status    |
| `Event`          | idx_event_created_by | createdBy |
| `TicketCategory` | idx_category_event   | eventId   |
| `Booking`        | idx_booking_user     | userId    |
| `Booking`        | idx_booking_event    | eventId   |
| `Booking`        | idx_booking_status   | status    |
| `Ticket`         | idx_ticket_code      | code      |
| `Ticket`         | idx_ticket_booking   | bookingId |
| `Refund`         | idx_refund_booking   | bookingId |

---

## Domain Events

| Event Name               | Payload                    |
| ------------------------ | -------------------------- |
| `EventCreated`           | eventId, organizerId       |
| `EventPublished`         | eventId                    |
| `EventCancelled`         | eventId, reason            |
| `TicketCategoryCreated`  | categoryId, eventId        |
| `TicketCategoryDisabled` | categoryId                 |
| `BookingCreated`         | bookingId, userId, eventId |
| `BookingPaid`            | bookingId, paymentAmount   |
| `BookingExpired`         | bookingId                  |
| `TicketIssued`           | ticketId, bookingId        |
| `TicketCheckedIn`        | ticketId, eventId          |
| `RefundRequested`        | refundId, bookingId        |
| `RefundApproved`         | refundId                   |
| `RefundRejected`         | refundId, reason           |
| `RefundPaid`             | refundId, amount           |
