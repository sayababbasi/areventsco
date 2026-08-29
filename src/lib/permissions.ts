// Role-Based Access Control (RBAC) System for AR Events Co.

export type Role = "SUPER_ADMIN" | "ADMIN" | "EVENT_MANAGER" | "STAFF" | "CUSTOMER";

export type Permission =
  | "booking.read"
  | "booking.create"
  | "booking.update"
  | "booking.cancel"
  | "booking.confirm"
  | "booking.assign"
  | "payment.read"
  | "payment.record"
  | "payment.refund"
  | "catalog.read"
  | "catalog.manage"
  | "cms.read"
  | "cms.manage"
  | "users.read"
  | "users.manage"
  | "reports.read"
  | "settings.read"
  | "settings.manage"
  | "audit.read";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "booking.read",
    "booking.create",
    "booking.update",
    "booking.cancel",
    "booking.confirm",
    "booking.assign",
    "payment.read",
    "payment.record",
    "payment.refund",
    "catalog.read",
    "catalog.manage",
    "cms.read",
    "cms.manage",
    "users.read",
    "users.manage",
    "reports.read",
    "settings.read",
    "settings.manage",
    "audit.read",
  ],
  ADMIN: [
    "booking.read",
    "booking.create",
    "booking.update",
    "booking.cancel",
    "booking.confirm",
    "booking.assign",
    "payment.read",
    "payment.record",
    "payment.refund",
    "catalog.read",
    "catalog.manage",
    "cms.read",
    "cms.manage",
    "users.read",
    "reports.read",
    "settings.read",
    "settings.manage",
    "audit.read",
  ],
  EVENT_MANAGER: [
    "booking.read",
    "booking.update",
    "booking.assign",
    "catalog.read",
    "payment.read",
    "reports.read",
  ],
  STAFF: [
    "booking.read",
    "catalog.read",
  ],
  CUSTOMER: [
    "booking.read",
    "booking.create",
    "booking.cancel",
    "payment.read",
    "catalog.read",
  ],
};

/**
 * Checks if a specific role possesses the requested permission
 */
export function hasPermission(role: string, permission: Permission): boolean {
  const allowed = ROLE_PERMISSIONS[role as Role];
  if (!allowed) return false;
  return allowed.includes(permission);
}

/**
 * Validates if the role belongs to internal operations (Staff or higher)
 */
export function isStaffOrAdmin(role: string): boolean {
  return ["SUPER_ADMIN", "ADMIN", "EVENT_MANAGER", "STAFF"].includes(role);
}

/**
 * Validates if the role belongs to business administration (Admin or higher)
 */
export function isAdmin(role: string): boolean {
  return ["SUPER_ADMIN", "ADMIN"].includes(role);
}
