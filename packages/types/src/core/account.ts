import z from "zod";
import { apiListQueryParamsSchema } from "../common/api-list-query-params.js";

export const normalBalanceSchema = z.enum(["DEBIT", "CREDIT"]);
export const accountTypeSchema = z.enum(
  ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"],
  "Pilih tipe akun untuk melanjutkan",
);

export const baseAccountSchema = z.object({
  normalBalance: normalBalanceSchema,
  type: accountTypeSchema,
  code: z.string("Kode akun wajib diisi").nonempty("Kode akun wajib diisi").regex(/^\d+$/, {
    message: "Kode akun hanya boleh terdiri dari angka",
  }),
  name: z.string("Nama akun wajib diisi").nonempty("Nama akun wajib diisi"),
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
export const editorAccountSchema = createAccountSchema;

export const accountSummarySchema = z.object({
  summary: z.object({
    totalDebit: z.number(),
    totalCredit: z.number(),
    netMutation: z.number(),
  }),
});

export const getAccountListQuerySchema = apiListQueryParamsSchema.extend({
  normalBalance: normalBalanceSchema.optional(),
  type: accountTypeSchema.optional(),
});

export const getAccountSummaryQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type INormalBalance = z.infer<typeof normalBalanceSchema>;
export type IAccountType = z.infer<typeof accountTypeSchema>;
export type IBaseAccount = z.infer<typeof baseAccountSchema>;
export type IAccount = z.infer<typeof accountSchema>;
export type ICreateAccount = z.infer<typeof createAccountSchema>;
export type IUpdateAccount = z.infer<typeof updateAccountSchema>;
export type IEditorAccount = z.infer<typeof editorAccountSchema>;
export type IAccountSummary = z.infer<typeof accountSummarySchema>;

export type IGetAccountListQuery = z.infer<typeof getAccountListQuerySchema>;
export type IGetAccountSummaryQuery = z.infer<typeof getAccountSummaryQuerySchema>;

export type IAccountBase = z.infer<typeof accountSchema>;

export interface IAccountNode extends IAccountBase {
  children: IAccountNode[];
}

export const accountNodeSchema: z.ZodType<IAccountNode> = accountSchema.extend({
  children: z.lazy(() => accountNodeSchema.array()),
});

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

export const ACCOUNT_TYPE_PREFIX_MAP: Record<IAccountType, string> = {
  ASSET: "1",
  LIABILITY: "2",
  EQUITY: "3",
  REVENUE: "4",
  EXPENSE: "5",
};
