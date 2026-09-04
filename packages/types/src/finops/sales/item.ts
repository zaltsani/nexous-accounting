import z from "zod";

export const baseSalesItemSchema = z.object({
  itemName: z.string().trim().min(1, "Nama barang/jasa wajib diisi"),
  quantity: z.number("Kuantitas wajib diisi").positive("Kuantitas harus lebih besar dari 0"),
  unitPrice: z.number("Harga satuan wajib diisi").nonnegative("Harga satuan tidak boleh negatif"),
  revenueAccountId: z.string().uuid("ID Akun Pendapatan tidak valid"),
});

export const salesItemSchema = baseSalesItemSchema.extend({
  id: z.string(),
  subtotal: z.number().nonnegative(),
  salesInvoiceId: z.string().uuid(),
});

export type IBaseSalesItem = z.infer<typeof baseSalesItemSchema>;
export type ISalesItem = z.infer<typeof salesItemSchema>;
