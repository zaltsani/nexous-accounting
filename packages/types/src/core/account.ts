import z from "zod";

export const normalBalanceSchema = z.enum(["DEBIT", "CREDIT"]);
export const accountTypeSchema = z.enum(["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"]);

export const baseAccountSchema = z.object({
  normalBalance: normalBalanceSchema,
  type: accountTypeSchema,
  code: z.string(),
  name: z.string(),
  parentId: z.string().nullish(),
});

export const accountSchema = baseAccountSchema.extend({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createAccountSchema = baseAccountSchema;
export const updateAccountSchema = createAccountSchema.partial();

export type INormalBalance = z.infer<typeof normalBalanceSchema>;
export type IAccountType = z.infer<typeof accountTypeSchema>;
export type IBaseAccountSchema = z.infer<typeof baseAccountSchema>;
export type IAccount = z.infer<typeof accountSchema>;
export type ICreateAccount = z.infer<typeof createAccountSchema>;
export type IUpdateAccount = z.infer<typeof updateAccountSchema>;
