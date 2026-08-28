import z from "zod";
import { apiListQueryParamsSchema } from "../common/api-list-query-params.js";

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
  balance: z.coerce.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createAccountSchema = baseAccountSchema;
export const updateAccountSchema = createAccountSchema.partial();

export const getAccountListQuerySchema = apiListQueryParamsSchema.extend({
  normalBalance: normalBalanceSchema.optional(),
  type: accountTypeSchema.optional(),
});

export type INormalBalance = z.infer<typeof normalBalanceSchema>;
export type IAccountType = z.infer<typeof accountTypeSchema>;
export type IBaseAccountSchema = z.infer<typeof baseAccountSchema>;
export type IAccount = z.infer<typeof accountSchema>;
export type ICreateAccount = z.infer<typeof createAccountSchema>;
export type IUpdateAccount = z.infer<typeof updateAccountSchema>;
export type IGetAccountListQuery = z.infer<typeof getAccountListQuerySchema>;

export const normalBalanceLabels: Record<INormalBalance, string> = {
  DEBIT: "Debit",
  CREDIT: "Kredit",
};

export const accountTypeLabels: Record<IAccountType, string> = {
  ASSET: "Aset",
  LIABILITY: "Liabilitas",
  EQUITY: "Ekuitas",
  REVENUE: "Pendapatan",
  EXPENSE: "Beban",
};

export const normalBalanceAccountTypeMap: Record<IAccountType, INormalBalance> = {
  ASSET: "DEBIT",
  LIABILITY: "CREDIT",
  EQUITY: "CREDIT",
  REVENUE: "CREDIT",
  EXPENSE: "DEBIT",
} as const;
