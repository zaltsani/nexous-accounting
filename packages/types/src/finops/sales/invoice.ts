import z from "zod";
import { baseSalesItemSchema, salesItemSchema } from "./item.js";
import { salesSettlementSchema } from "./settlement.js";

export const salesTypeSchema = z.enum(["CREDIT_SALE", "CASH_SALE", "DOWN_PAYMENT"]);
export const invoiceStatusSchema = z.enum(["DRAFT", "UNPAID", "PARTIAL", "PAID", "VOID"]);
export const invoiceActionStatusSchema = z.enum(["DRAFT", "POST"], "Pilih status invoice");

export const baseInvoiceSchema = z.object({
  invoiceNumber: z.string(),
  customerName: z.string(),
  type: salesTypeSchema,
  issueDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  accountId: z.string(),
});

export const invoiceSchema = baseInvoiceSchema.extend({
  id: z.string(),

  status: invoiceStatusSchema,
  totalAmount: z.number(),
  unpaidAmount: z.number(),

  transactionId: z.string().nullish(),
  reversalTransId: z.string().nullish(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  items: salesItemSchema.array(),
  settlements: salesSettlementSchema.array(),
});

export const createInvoiceSchema = baseInvoiceSchema.extend({
  action: invoiceActionStatusSchema,
  settlementAccountId: z.string().uuid().nullish(),
  downPaymentAmount: z.number().nonnegative().nullish(),
  items: baseSalesItemSchema.array(),
});

export const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  items: baseSalesItemSchema.array(),
});

export const editorInvoiceSchema = createInvoiceSchema.refine(
  (data) => {
    // If downPaymentAmount > 0, settlementAccountId must be provided
    if (data.downPaymentAmount && data.downPaymentAmount > 0) {
      return !!data.settlementAccountId;
    }
    return true;
  },
  {
    message: "Akun Kas/Bank wajib dipilih jika ada jumlah Uang Muka yang diterima",
    path: ["settlementAccountId"],
  },
);

export type ISalesType = z.infer<typeof salesTypeSchema>;
export type IInvoiceStatus = z.infer<typeof invoiceStatusSchema>;
export type IInvoiceActionStatus = z.infer<typeof invoiceActionStatusSchema>;

export type IBaseInvoice = z.infer<typeof baseInvoiceSchema>;
export type IInvoice = z.infer<typeof invoiceSchema>;
export type ICreateInvoice = z.infer<typeof createInvoiceSchema>;
export type IUpdateInvoice = z.infer<typeof updateInvoiceSchema>;
export type IEditorInvoice = z.infer<typeof editorInvoiceSchema>;
