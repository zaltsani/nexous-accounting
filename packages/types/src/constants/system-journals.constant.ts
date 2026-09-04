export const SYSTEM_JOURNALS = {
  GENERAL: { code: "JU", name: "Jurnal Umum" },
  SALES: { code: "JP", name: "Jurnal Penjualan" },
  PURCHASE: { code: "JB", name: "Jurnal Pembelian" },
  PAYMENT: { code: "JK", name: "Jurnal Pembayaran" },
} as const;

export type SystemJournalKey = keyof typeof SYSTEM_JOURNALS;
export type SystemJournalCode = (typeof SYSTEM_JOURNALS)[keyof typeof SYSTEM_JOURNALS]["code"];
