# Enterprise Invoice Subsystem Documentation — AR Events Co.

## 1. Overview
The AR Events Co. invoice subsystem is an enterprise-grade financial and billing lifecycle engine designed specifically for luxury birthday and event-planning services in Islamabad & Rawalpindi. 

It guarantees:
- **No floating-point drift**: All financial fields use minor-unit integer arithmetic (1 PKR = 100 Paisa).
- **Snapshot Immutability**: Historical line items, unit prices, discounts, and event specifications are locked into snapshot records so catalog modifications do not rewrite previously issued invoices.
- **Cryptographic & RBAC Security**: Server-side role authorization for admin operations and token/session validation for client portal downloads.
- **Vector PDF Generation**: Print-ready, structured A4 PDF invoices generated dynamically using `jspdf` and `jspdf-autotable`.

---

## 2. Invoicing Lifecycle Architecture

```
Customer Booking Request (Web / Admin)
                 │
                 ▼
Database Transaction (Prisma + Supabase PostgreSQL)
                 │
                 ├── Customer & Booking Record
                 ├── Booking Items Snapshot
                 ├── Initial Digital Invoice (INV-YYYY-XXXX)
                 └── Invoice Line Items Snapshot
                 │
                 ▼
Invoice Status: UNPAID / ISSUED (Due Date: +3 Days)
                 │
                 ├── Customer views on /booking/[reference]
                 ├── Admin manages on /admin/invoices/[id]
                 │
                 ▼
Payment Verification (Bank Slip / Cash / Card)
                 │
                 ├── Record Payment with Method & Reference
                 ├── Recalculate Total Paid & Balance Due
                 ├── Transition Status: UNPAID ──> PARTIALLY_PAID ──> PAID
                 ├── Transition Booking: INQUIRY ──> CONFIRMED (on deposit)
                 └── Log event in InvoiceAuditLog
                 │
                 ▼
Vector PDF Generation (/api/invoices/[id]/pdf)
                 │
                 ├── AR Events Co. Luxury Branding & Contact Info
                 ├── Bill To & Event Specifications
                 ├── Itemized Table (Package, Theme, Services, Add-ons, Venue)
                 ├── Financial Summary & Outstanding Balance
                 ├── Meezan Bank Payment Instructions
                 └── Verified Payment History Table
```

---

## 3. Database Schema & Models

### `Invoice` Model
```prisma
model Invoice {
  id                     String            @id @default(cuid())
  invoiceNumber          String            @unique // e.g. INV-2026-0042
  bookingId              String
  booking                Booking           @relation(fields: [bookingId], references: [id])
  
  customerName           String
  customerEmail          String
  customerPhone          String?
  customerAddress        String?
  
  subtotalMinor          Int
  discountMinor          Int               @default(0)
  taxMinor               Int               @default(0)
  additionalChargesMinor Int               @default(0)
  totalAmountMinor       Int
  amountPaidMinor        Int               @default(0)
  balanceDueMinor        Int               @default(0)
  depositRequiredMinor   Int               @default(0)
  currency               String            @default("PKR")
  
  status                 String            @default("UNPAID") // DRAFT, ISSUED, UNPAID, PARTIALLY_PAID, PAID, OVERDUE, CANCELLED, VOID
  dueDate                DateTime
  issuedAt               DateTime?         @default(now())
  paidAt                 DateTime?
  customerNotes          String?
  internalNotes          String?
  pdfUrl                 String?
  createdAt              DateTime          @default(now())
  updatedAt              DateTime          @updatedAt

  items                  InvoiceItem[]
  payments               Payment[]
  auditLogs              InvoiceAuditLog[]

  @@index([bookingId])
  @@index([status])
  @@index([customerEmail])
}
```

### `InvoiceItem` Model
```prisma
model InvoiceItem {
  id              String   @id @default(cuid())
  invoiceId       String
  invoice         Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  
  description     String
  unitPriceMinor  Int
  quantity        Int      @default(1)
  totalPriceMinor Int
  currency        String   @default("PKR")

  @@index([invoiceId])
}
```

### `Payment` Model
```prisma
model Payment {
  id              String    @id @default(cuid())
  bookingId       String
  booking         Booking   @relation(fields: [bookingId], references: [id])
  invoiceId       String?
  invoice         Invoice?  @relation(fields: [invoiceId], references: [id])
  
  amountMinor     Int
  currency        String    @default("PKR")
  paymentType     String    @default("DEPOSIT")
  paymentMethod   String    @default("BANK_TRANSFER")
  status          String    @default("VERIFIED")
  
  providerRef     String?
  receiptImage    String?
  notes           String?
  paidAt          DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([bookingId])
  @@index([invoiceId])
}
```

### `InvoiceAuditLog` Model
```prisma
model InvoiceAuditLog {
  id          String   @id @default(cuid())
  invoiceId   String
  invoice     Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  action      String
  performedBy String   @default("System")
  details     String?
  createdAt   DateTime @default(now())

  @@index([invoiceId])
}
```

---

## 4. API Endpoints Reference

| Method | Endpoint | Description | Access Control |
|---|---|---|---|
| `GET` | `/api/admin/invoices` | List invoices with statistics, search, filters, pagination | Admin / Staff |
| `GET` | `/api/admin/invoices/[id]` | Get detailed invoice with line items, payments, audit log | Admin / Staff |
| `PATCH` | `/api/admin/invoices/[id]` | Update invoice notes, due date, discounts, adjustments | Admin / Staff |
| `POST` | `/api/admin/invoices/[id]/payments` | Record verified payment and recalculate balance | Admin / Staff |
| `GET` | `/api/invoices/[id]/pdf` | Download official print-ready vector A4 PDF | Admin / Staff / Token |
| `GET` | `/api/bookings/[reference]/invoice` | Client portal invoice view | Booking Owner |

---

## 5. Security & Authorization
1. **Admin / Staff RBAC**: Protected by HMAC-SHA256 signed session cookie verified in Edge runtime.
2. **Customer Access Protection**: Customers can only view and download invoices associated with their booking reference or verified authenticated email. Direct attempts to enumerate other invoice IDs without valid credentials or matching reference tokens are rejected with `401 Unauthorized`.
3. **Audit Trails**: Every invoice modification, status change, and payment verification records an immutable entry in `InvoiceAuditLog`.
