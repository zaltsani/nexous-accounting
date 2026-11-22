import { z } from "zod";

export const baseUserSchema = z.object({
  email: z.string(),
  name: z.string(),
});

export const userSchema = baseUserSchema.extend({
  id: z.string().uuid(),
  isActive: z.boolean(),
});

export const createUserSchema = baseUserSchema.extend({
  password: z.string().min(8).max(128),
});

export type IUser = z.infer<typeof userSchema>;
export type ICreateUser = z.infer<typeof createUserSchema>;
