# API Specification

## Conventions
- JSON request/response unless file upload requires multipart.
- Version APIs when breaking changes are introduced.
- Use plural resource names.
- Return consistent error shapes.

## Error Shape
```json
{
  "error": {
    "code": "BOOKING_NOT_AVAILABLE",
    "message": "The selected time is no longer available.",
    "details": {}
  }
}
```

## Public Read Endpoints
```text
GET /api/packages
GET /api/packages/:slug
GET /api/themes
GET /api/themes/:slug
GET /api/services
GET /api/gallery
GET /api/reviews
GET /api/faqs
GET /api/settings/public
```

## Customer Endpoints
```text
POST /api/bookings
GET  /api/me/bookings
GET  /api/me/bookings/:id
GET  /api/me/invoices
GET  /api/me/payments
```

## Admin Endpoints
```text
GET/PATCH /api/admin/bookings
GET/PATCH /api/admin/customers
GET/POST/PATCH /api/admin/packages
GET/POST/PATCH /api/admin/themes
GET/POST/PATCH /api/admin/services
GET/POST/PATCH /api/admin/addons
GET/POST/PATCH /api/admin/venues
GET/POST/PATCH /api/admin/staff
GET/POST/PATCH /api/admin/payments
GET/POST/PATCH /api/admin/coupons
GET/POST/PATCH /api/admin/cms/pages
GET /api/admin/reports
```

## Mutation Rule
Every mutation must pass authentication, authorization, validation, and audit rules where applicable.
