export type AdminRole = "STAFF" | "ADMIN" | "SUPER_ADMIN";

export type ActivityType =
  | "PRODUCT_CREATED"
  | "PRODUCT_UPDATED"
  | "PRODUCT_ARCHIVED"
  | "PRODUCT_RESTORED"
  | "PRODUCT_HARD_DELETED"
  | "CATEGORY_CREATED"
  | "CATEGORY_UPDATED"
  | "CATEGORY_DELETED"
  | "CURRENCY_RATE_CREATED"
  | "CURRENCY_RATE_UPDATED"
  | "ADMIN_CREATED";

export interface ActivityActor {
  id: string;
  email: string;
  name?: string;
  role: AdminRole;
}

export interface ActivityLog {
  id: string;
  activityType: ActivityType;
  entity: string;
  entityId?: string | null;
  message: string;
  createdAt: string;
  actor?: ActivityActor | null;
}
