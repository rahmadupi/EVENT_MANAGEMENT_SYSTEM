# API Specification

This document describes the REST API endpoints for the Event Management System.

---

## Base URL

```
Base URL: /api/v1
```

---

## Authentication

### POST /auth/login
Login to the system.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response (200):**
```json
{
  "accessToken": "string",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "string",
    "role": "EVENT_ORGANIZER"
  }
}
```

### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "string",
  "name": "string",
  "role": "CUSTOMER"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "string",
  "role": "CUSTOMER"
}
```

---

## Events

### GET /events
Get all available events.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status (DRAFT, PUBLISHED, CANCELLED) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "startDate": "2024-01-01T10:00:00Z",
      "endDate": "2024-01-01T18:00:00Z",
      "location": "string",
      "maxCapacity": 1000,
      "status": "PUBLISHED"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### GET /events/:id
Get event details.

**Response (200):**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "startDate": "2024-01-01T10:00:00Z",
  "endDate": "2024-01-01T18:00:00Z",
  "location": "string",
  "maxCapacity": 1000,
  "status": "PUBLISHED",
  "categories": [
    {
      "id": "uuid",
      "name": "VIP",
      "price": 100.00,
      "quota": 100,
      "salesStartDate": "2024-01-01T00:00:00Z",
      "salesEndDate": "2024-01-01T09:00:00Z",
      "isActive": true
    }
  ]
}
```

### POST /events
Create a new event. **(Event Organizer only)**

**Request:**
```json
{
  "name": "string",
  "description": "string",
  "startDate": "2024-01-01T10:00:00Z",
  "endDate": "2024-01-01T18:00:00Z",
  "location": "string",
  "maxCapacity": 1000
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "startDate": "2024-01-01T10:00:00Z",
  "endDate": "2024-01-01T18:00:00Z",
  "location": "string",
  "maxCapacity": 1000,
  "status": "DRAFT",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### PATCH /events/:id/publish
Publish an event. **(Event Organizer only)**

**Response (200):**
```json
{
  "id": "uuid",
  "status": "PUBLISHED"
}
```

### DELETE /events/:id/cancel
Cancel an event. **(Event Organizer only)**

**Response (200):**
```json
{
  "id": "uuid",
  "status": "CANCELLED"
}
```

---

## Ticket Categories

### GET /events/:eventId/categories
Get all ticket categories for an event.

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "VIP",
      "price": 100.00,
      "quota": 100,
      "availableQuota": 50,
      "salesStartDate": "2024-01-01T00:00:00Z",
      "salesEndDate": "2024-01-01T09:00:00Z",
      "isActive": true,
      "refundPolicy": "REFUNDABLE"
    }
  ]
}
```

### POST /events/:eventId/categories
Create a ticket category. **(Event Organizer only)**

**Request:**
```json
{
  "name": "VIP",
  "price": 100.00,
  "quota": 100,
  "salesStartDate": "2024-01-01T00:00:00Z",
  "salesEndDate": "2024-01-01T09:00:00Z",
  "refundPolicy": "REFUNDABLE"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "eventId": "uuid",
  "name": "VIP",
  "price": 100.00,
  "quota": 100,
  "salesStartDate": "2024-01-01T00:00:00Z",
  "salesEndDate": "2024-01-01T09:00:00Z",
  "isActive": true,
  "refundPolicy": "REFUNDABLE"
}
```

### PATCH /categories/:id/disable
Disable a ticket category. **(Event Organizer only)**

**Response (200):**
```json
{
  "id": "uuid",
  "isActive": false
}
```

---

## Bookings

### POST /bookings
Create a new booking. **(Customer only)**

**Request:**
```json
{
  "eventId": "uuid",
  "items": [
    {
      "categoryId": "uuid",
      "quantity": 2
    }
  ]
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "eventId": "uuid",
  "status": "PENDING_PAYMENT",
  "totalPrice": 200.00,
  "expiresAt": "2024-01-01T10:15:00Z",
  "items": [
    {
      "categoryId": "uuid",
      "categoryName": "VIP",
      "quantity": 2,
      "unitPrice": 100.00,
      "subtotal": 200.00
    }
  ]
}
```

### GET /bookings/:id
Get booking details.

**Response (200):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "eventId": "uuid",
  "eventName": "string",
  "status": "PAID",
  "totalPrice": 200.00,
  "paidAt": "2024-01-01T10:05:00Z",
  "expiresAt": "2024-01-01T10:15:00Z",
  "tickets": [
    {
      "id": "uuid",
      "code": "EVT-A1B2C3-D4E5F6G7",
      "status": "ACTIVE"
    }
  ]
}
```

### POST /bookings/:id/pay
Pay for a booking. **(Customer only)**

**Request:**
```json
{
  "paymentMethod": "credit_card",
  "cardToken": "string"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "status": "PAID",
  "paidAt": "2024-01-01T10:05:00Z",
  "tickets": [
    {
      "id": "uuid",
      "code": "EVT-A1B2C3-D4E5F6G7"
    }
  ]
}
```

### GET /bookings/my
Get current user's bookings. **(Customer only)**

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response (200):**
```json
{
  "data": [...],
  "meta": {...}
}
```

---

## Tickets

### GET /tickets/:id
Get ticket details.

**Response (200):**
```json
{
  "id": "uuid",
  "code": "EVT-A1B2C3-D4E5F6G7",
  "eventId": "uuid",
  "eventName": "string",
  "categoryName": "VIP",
  "status": "ACTIVE",
  "checkedInAt": null
}
```

### GET /tickets/my
Get current user's purchased tickets. **(Customer only)**

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "code": "EVT-A1B2C3-D4E5F6G7",
      "eventName": "string",
      "eventDate": "2024-01-01T10:00:00Z",
      "categoryName": "VIP",
      "status": "ACTIVE"
    }
  ]
}
```

---

## Check-In

### POST /check-in/validate
Validate a ticket before check-in. **(Gate Officer only)**

**Request:**
```json
{
  "ticketCode": "EVT-A1B2C3-D4E5F6G7",
  "eventId": "uuid"
}
```

**Response (200):**
```json
{
  "valid": true,
  "ticket": {
    "id": "uuid",
    "code": "EVT-A1B2C3-D4E5F6G7",
    "status": "ACTIVE",
    "categoryName": "VIP",
    "holderName": "string"
  }
}
```

### POST /check-in/tickets
Check in a ticket. **(Gate Officer only)**

**Request:**
```json
{
  "ticketCode": "EVT-A1B2C3-D4E5F6G7",
  "eventId": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "ticket": {
    "id": "uuid",
    "code": "EVT-A1B2C3-D4E5F6G7",
    "status": "CHECKED_IN",
    "checkedInAt": "2024-01-01T10:05:00Z"
  }
}
```

---

## Refunds

### POST /refunds
Request a refund. **(Customer only)**

**Request:**
```json
{
  "bookingId": "uuid",
  "reason": "string"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "bookingId": "uuid",
  "amount": 200.00,
  "status": "REQUESTED",
  "requestedAt": "2024-01-01T10:00:00Z"
}
```

### GET /refunds
Get all refund requests. **(Event Organizer only)**

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status |
| `eventId` | uuid | Filter by event |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "bookingId": "uuid",
      "amount": 200.00,
      "status": "REQUESTED",
      "requestedAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### PATCH /refunds/:id/approve
Approve a refund. **(Event Organizer only)**

**Response (200):**
```json
{
  "id": "uuid",
  "status": "APPROVED"
}
```

### PATCH /refunds/:id/reject
Reject a refund. **(Event Organizer only)**

**Request:**
```json
{
  "reason": "string"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "status": "REJECTED"
}
```

### PATCH /refunds/:id/pay
Process refund payout. **(System Admin only)**

**Response (200):**
```json
{
  "id": "uuid",
  "status": "PAID_OUT",
  "processedAt": "2024-01-01T10:00:00Z"
}
```

---

## Reports

### GET /reports/events/:eventId/sales
Get event sales report. **(Event Organizer only)**

**Response (200):**
```json
{
  "eventId": "uuid",
  "eventName": "string",
  "totalRevenue": 50000.00,
  "totalTicketsSold": 500,
  "bookingsCount": 300,
  "byCategory": [
    {
      "categoryName": "VIP",
      "ticketsSold": 100,
      "revenue": 10000.00
    }
  ]
}
```

### GET /reports/events/:eventId/participants
Get event participant list. **(Event Organizer only)**

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response (200):**
```json
{
  "data": [
    {
      "ticketId": "uuid",
      "ticketCode": "EVT-A1B2C3-D4E5F6G7",
      "holderName": "string",
      "categoryName": "VIP",
      "checkedIn": true,
      "checkedInAt": "2024-01-01T10:05:00Z"
    }
  ],
  "meta": {
    "totalParticipants": 500,
    "checkedInCount": 300
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 422 Unprocessable Entity
```json
{
  "statusCode": 422,
  "message": "Payment deadline exceeded"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## Rate Limiting

- **Auth endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute

---

## Pagination

All list endpoints support pagination:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max: 100) |

Response includes:
```json
{
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```