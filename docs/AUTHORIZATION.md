# Authentication & Authorization

## Roles
### SUPER_ADMIN
Everything, including security configuration and role management.

### ADMIN
Operational management without changing platform-level access policies unless granted.

### EVENT_MANAGER
View/manage assigned events and customer/event operational information.

### STAFF
View tasks/events explicitly assigned to the staff member.

### CUSTOMER
Access only their own profile, bookings, payments, invoices, and notifications.

## Rules
1. Authentication identifies the user.
2. Authorization decides what the user can do.
3. Resource ownership must be checked server-side.
4. Hiding a button is not authorization.
5. Every mutation must enforce permission checks.
6. Audit high-impact admin actions.

## Permission Naming
Use stable permission codes such as:
```text
booking.read
booking.create
booking.update
booking.cancel
booking.confirm
payment.read
payment.update
catalog.manage
cms.manage
user.manage
settings.manage
report.read
```

## Customer Access Example
A customer may request `/api/bookings/:id`, but the server must confirm that the booking belongs to that authenticated customer.
