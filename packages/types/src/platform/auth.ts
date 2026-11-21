import { z } from 'zod';
import { tenantMembershipSchema } from './tenant.js';
import { userSchema } from './user.js';

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(128),
  tenantId: z.string().uuid().optional(),
});

export const selectTenantSchema = z.object({
  tenantId: z.string().uuid(),
});

export const refreshSchema = z.object({ refreshToken: z.string().min(1) });

export const authTokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});

export const loginResultSchema = z.object({
  user: userSchema,
  tenants: tenantMembershipSchema.array(),
  tenantId: z.string().nullish(),
  tokens: authTokenSchema,
});

export const accessTokenPayloadSchema = z.object({
  sub: z.string(),
  tid: z.string().optional(),
  role: z.string().optional(),
});

export type ILogin = z.infer<typeof loginSchema>;
export type ISelectTenant = z.infer<typeof selectTenantSchema>;
export type IRefresh = z.infer<typeof refreshSchema>;
export type IAuthToken =z.infer<typeof authTokenSchema>;
export type ILoginResult = z.infer<typeof loginResultSchema>;
export type IAccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;
