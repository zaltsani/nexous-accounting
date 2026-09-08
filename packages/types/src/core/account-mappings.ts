import z from "zod";

export const accountOperationSchema = z.enum([
  "RETAINED_EARNINGS",
  "CURRENT_YEAR_EARNINGS",
  "OPENING_BALANCE_EQUITY",

  "DEFAULT_CASH",

  "DEFAULT_AR",
  "DEFAULT_SALES",

  "DEFAULT_AP",
  "DEFAULT_PURCHASE",

  "DEFAULT_INVENTORY",
  "DEFAULT_COGS",

  "DEFAULT_SALES_TAX",
  "DEFAULT_PURCHASE_TAX",

  "DEFAULT_DEPRECIATION_EXPENSE",
  "DEFAULT_ACCUMULATED_DEPRECIATION",
]);

export const baseAccountMappingSchema = z.object({
  operation: accountOperationSchema,
  accountId: z.string().uuid(),
});

export const accountMappingSchema = baseAccountMappingSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type IAccountOperation = z.infer<typeof accountOperationSchema>;
export type IBaseAccountMapping = z.infer<typeof baseAccountMappingSchema>;
export type IAccountMapping = z.infer<typeof accountMappingSchema>;
