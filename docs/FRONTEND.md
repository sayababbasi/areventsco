# Frontend Architecture

## 1. Public Routes
```text
/
/about
/events
/events/birthdays
/packages
/packages/[slug]
/themes
/themes/[slug]
/services
/services/[slug]
/venues
/gallery
/reviews
/faq
/contact
/book
/booking/[reference]
```

## 2. Customer Routes
```text
/login
/register
/dashboard
/dashboard/bookings
/dashboard/bookings/[id]
/dashboard/payments
/dashboard/invoices
/dashboard/notifications
/dashboard/profile
```

## 3. Admin Routes
```text
/admin
/admin/bookings
/admin/calendar
/admin/customers
/admin/packages
/admin/themes
/admin/services
/admin/addons
/admin/venues
/admin/vendors
/admin/staff
/admin/payments
/admin/invoices
/admin/gallery
/admin/reviews
/admin/coupons
/admin/notifications
/admin/reports
/admin/cms
/admin/seo
/admin/settings
/admin/users
/admin/audit-log
```

## 4. UI Principles
- Mobile-first.
- Premium, celebratory, but not visually overloaded.
- Strong hierarchy and obvious CTAs.
- Booking CTA should remain easy to find.
- Use server-rendered content where possible for SEO.
- Use client components only when interaction requires them.

## 5. Shared Components
- Header / mobile navigation
- Footer
- Hero
- Package card
- Theme card
- Service card
- Gallery grid
- Review card
- Price summary
- Booking stepper
- Date/time selector
- Availability indicator
- Modal / drawer
- Data table
- Filter bar
- Status badge
- Form controls
- Rich text editor
- Media uploader

## 6. State Management
Prefer server state and URL state. Use local component state for forms and UI interactions. Introduce a global client store only when a real cross-route requirement appears.

## 7. Forms
All important forms must have:
- Client-side feedback
- Server-side validation
- Clear error states
- Disabled/loading states
- Success confirmation
- Accessible labels
