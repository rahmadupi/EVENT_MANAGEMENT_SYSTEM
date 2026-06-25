## Class Diagram

```
┌──────────┐     ┌──────────┐     ┌────────────────┐
│   User   │────▶│  Event   │────▶│TicketCategory │
└──────────┘     └──────────┘     └────────────────┘
      │                                  │
      │                                  ▼
      │                             ┌────────────┐
      │                             │  Booking  │
      │                             └──────────┘
      │                                   │
      │                                   ▼
      │                              ┌────────────┐
      │                              │ BookingItem│
      │                              └──────────┘
      │                                   │
      │                                   ▼
      │                              ┌────────────┐
      │                              │  Ticket  │
      │                              └──────────┘
      │                                   │
      │                                   ▼
      │                              ┌────────────┐
      └─────────────────────────────▶│  Refund  │
                                   └──────────┘
```

## Database Schema

```prisma
// Core entities: User, Event, TicketCategory, Booking, BookingItem, Ticket, Refund, AuditLog
// See: prisma/schema.prisma for complete schema
```

## Tech Stack

| Category            | Technology         |
| ------------------- | ------------------ |
| **Runtime**         | Node.js 20.x       |
| **Framework**       | NestJS 11.x        |
| **Language**        | TypeScript 5.x     |
| **Database**        | PostgreSQL         |
| **ORM**             | Prisma 7.x         |
| **Package Manager** | pnpm               |
| **Authentication**  | JWT (passport-jwt) |
| **Testing**         | Jest               |
| **Architecture**    | Clean Architecture |

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## API Documentation

### Base URL

```
/api/v1
```

### Authentication

| Method | Endpoint         | Description               | Access |
| ------ | ---------------- | ------------------------- | ------ |
| POST   | `/auth/login`    | Login with email/password | Public |
| POST   | `/auth/register` | Register new user         | Public |

### Events

| Method | Endpoint              | Description       | Access          |
| ------ | --------------------- | ----------------- | --------------- |
| GET    | `/events`             | List all events   | Public          |
| GET    | `/events/:id`         | Get event details | Public          |
| POST   | `/events`             | Create new event  | Event Organizer |
| PATCH  | `/events/:id/publish` | Publish event     | Event Organizer |
| DELETE | `/events/:id/cancel`  | Cancel event      | Event Organizer |

### Ticket Categories

| Method | Endpoint                      | Description      | Access          |
| ------ | ----------------------------- | ---------------- | --------------- |
| GET    | `/events/:eventId/categories` | List categories  | Public          |
| POST   | `/events/:eventId/categories` | Create category  | Event Organizer |
| PATCH  | `/categories/:id/disable`     | Disable category | Event Organizer |

### Bookings

| Method | Endpoint               | Description            | Access   |
| ------ | ---------------------- | ---------------------- | -------- |
| GET    | `/bookings`            | List user bookings     | Customer |
| POST   | `/bookings`            | Create booking         | Customer |
| GET    | `/bookings/:id`        | Get booking details    | Customer |
| POST   | `/bookings/:id/pay`    | Pay for booking        | Customer |
| GET    | `/bookings/:id/expire` | Expire pending booking | System   |

### Tickets

| Method | Endpoint         | Description         | Access   |
| ------ | ---------------- | ------------------- | -------- |
| GET    | `/tickets/:code` | View ticket by code | Customer |

### Check-in

| Method | Endpoint           | Description           | Access |
| ------ | ------------------ | --------------------- | ------ |
| POST   | `/check-in`        | Check in ticket       | Staff  |
| POST   | `/check-in/reject` | Reject invalid ticket | Staff  |

### Refunds

| Method | Endpoint                 | Description         | Access   |
| ------ | ------------------------ | ------------------- | -------- |
| POST   | `/refunds`               | Request refund      | Customer |
| GET    | `/refunds`               | List refunds        | Customer |
| PATCH  | `/refunds/:id/approve`   | Approve refund      | Admin    |
| PATCH  | `/refunds/:id/reject`    | Reject refund       | Admin    |
| PATCH  | `/refunds/:id/mark-paid` | Mark refund as paid | Admin    |

### Reports

| Method | Endpoint                           | Description        | Access          |
| ------ | ---------------------------------- | ------------------ | --------------- |
| GET    | `/reports/sales`                   | Sales report       | Event Organizer |
| GET    | `/reports/events/:id/participants` | Event participants | Event Organizer |

### Users

| Method | Endpoint    | Description      | Access        |
| ------ | ----------- | ---------------- | ------------- |
| GET    | `/users/me` | Get current user | Authenticated |
| GET    | `/users`    | List users       | Admin         |
