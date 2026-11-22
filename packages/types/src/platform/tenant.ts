import { z } from "zod";

export const TENANT_ROLES = ["SUPERDAMIN", "OWNER", "ADMIN", "ACCOUNTANT", "VIEWER"] as const;
export const tenantRoleSchema = z.enum(TENANT_ROLES);

export const baseTenantSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(48)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase letters, numbers and dashes only"),
});

export const tenantSchema = baseTenantSchema.extend({
  id: z.string(),
  isActive: z.boolean(),
});

export const createTenantSchema = baseTenantSchema.extend({
  ownerUserId: z.string().uuid().optional(),
});

export const addTenantMemberSchema = z.object({
  tenantId: z.string().uuid(),
  userId: z.string().uuid(),
  role: tenantRoleSchema,
});

export const tenantMembershipSchema = z.object({
  tenant: tenantSchema,
  role: tenantRoleSchema,
});

export type ITenantRole = z.infer<typeof tenantRoleSchema>;
export type ITenant = z.infer<typeof tenantSchema>;
export type ICreateTenant = z.infer<typeof createTenantSchema>;
export type IAddTenantMember = z.infer<typeof addTenantMemberSchema>;
export type ITenantMembership = z.infer<typeof tenantMembershipSchema>;
