# System Architecture

## Overview

This document describes the system architecture for the Event Management System using NestJS with Clean Architecture principles.

---

## Layer Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                      │
│         (Controllers, DTOs, GraphQL Resolvers)             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
│          (Use Cases, Application Services, DTOs)             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                           │
│        (Entities, Value Objects, Domain Services)            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                      │
│    (Prisma Repository, External Services, Auth Module)    │
└─────────────────────────────────────────────────────────────┘
```

---

## Module Organization

```
src/
├── modules/
│   ├── auth/                 # Authentication & Authorization
│   ├── users/                # User management
│   ├── events/               # Event management
│   ├── ticket-categories/    # Ticket category management
│   ├── bookings/             # Booking management
│   ├── tickets/              # Ticket management
│   ├── refunds/              # Refund management
│   ├── check-in/             # Check-in management
│   └── reports/              # Report & analytics
├── common/
│   ├── decorators/           # Custom decorators
│   ├── filters/              # Exception filters
│   ├── guards/               # Guards
│   ├── interceptors/         # Interceptors
│   └── pipes/                # Validation pipes
├── config/                   # Configuration
├── database/                 # Database migrations & seeders
└── infrastructure/           # External service implementations
```

---

## Database Schema

- **Database**: PostgreSQL
- **ORM**: Prisma
- **Connection**: Connection pooling via Prisma Client

---

## External Systems Integration

| Service         | Interface              | Implementation                                            |
| --------------- | ---------------------- | --------------------------------------------------------- |
| Payment Gateway | `IPaymentService`      | `PaymentGatewayService`                                   |
| Refund Service  | `IRefundService`       | `BankRefundService`                                       |
| Notification    | `INotificationService` | `EmailNotificationService`, `WhatsAppNotificationService` |

---

## Authentication & Authorization

- **Auth Type**: JWT (JSON Web Tokens)
- **Roles**: Event Organizer, Customer, Gate Officer, System Admin
- **Password**: Bcrypt hashing

---

## API Style

- **Protocol**: REST API
- **Format**: JSON
- **Validation**: class-validator with DTOs
- **Documentation**: Swagger/OpenAPI

---

## Event-Driven Architecture

Domain events are published via NestJS EventEmitter:

| Domain Event      | Description                              |
| ----------------- | ---------------------------------------- |
| `EventCreated`    | Raised when new event is created         |
| `EventPublished`  | Raised when event is published           |
| `EventCancelled`  | Raised when event is cancelled           |
| `BookingCreated`  | Raised when booking is created           |
| `BookingPaid`     | Raised when booking payment is completed |
| `BookingExpired`  | Raised when booking expires              |
| `RefundRequested` | Raised when refund is requested          |
| `RefundApproved`  | Raised when refund is approved           |
| `RefundRejected`  | Raised when refund is rejected           |
| `RefundPaid`      | Raised when refund payout is completed   |
| `TicketCheckedIn` | Raised when ticket is checked in         |

---

## Security

1. **HTTPS** - All production traffic over TLS
2. **Rate Limiting** - Protect endpoints from abuse
3. **CORS** - Restrict allowed origins
4. **Helmet** - Security headers
5. **Input Validation** - All inputs validated
