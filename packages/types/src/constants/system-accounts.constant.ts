/** Level 1: Root Accounts */
export const SYSTEM_ROOT_CODES = {
  ASSET: "10000",
  LIABILITY: "20000",
  EQUITY: "30000",
  REVENUE: "40000",
  EXPENSE: "50000",
} as const;

/** Level 2: Core Balance Sheet Sub-Headers */
export const SYSTEM_SUB_HEADER_CODES = {
  CURRENT_ASSET: "11000", // Aset Lancar
  CASH_AND_EQUIVALENTS: "11100", // Kas & Setara Kas
  RECEIVABLE: "11200", // Piutang Usaha
  INVENTORY: "11300", // Persediaan
  PREPAID_TAX: "11400", // Pajak Dibayar Di Muka

  NON_CURRENT_ASSET: "12000", // Aset Tidak Lancar
  FIXED_ASSET: "12100", // Aset Tetap
  ACCUMULATED_DEPRECIATION: "12200", // Akumulasi Penyusutan

  CURRENT_LIABILITY: "21000", // Liabilitas Jangka Pendek
  PAYABLE: "21100", // Utang Usaha
  TAX_PAYABLE: "21200", // Utang Pajak

  LONG_TERM_LIABILITY: "22000", // Liabilitas Jangka Panjang
  LONG_TERM_BANK_LOAN: "22100", // Utang Bank Jangka Panjang

  OWNER_EQUITY: "31000", // Modal Pemilik
  RETAINED_EARNINGS: "32000", // Saldo Laba Header

  OPERATIONAL_REVENUE: "41000", // Pendapatan Operasional

  COGS: "51000", // Beban Pokok Penjualan
  OPERATIONAL_EXPENSE: "52000", // Beban Operasional
  DEPRECIATION_EXPENSE: "53000", // Beban Penyusutan
} as const;

/** Core Accounting Engine Leaf Accounts (Math & System Operations) */
export const SYSTEM_ENGINE_ACCOUNT_CODES = {
  RETAINED_EARNINGS: "32101", // Laba Ditahan
  CURRENT_YEAR_EARNINGS: "32102", // Laba Tahun Berjalan
  OPENING_BALANCE_EQUITY: "39999", // Saldo Awal Ekuitas
} as const;

/**
 * Consolidated set of account codes that CANNOT be deleted.
 * Protects Level 1 roots, Level 2 sub-headers, and critical engine accounts.
 */
export const NON_DELETABLE_ACCOUNT_CODES: ReadonlySet<string> = new Set([
  ...Object.values(SYSTEM_ROOT_CODES),
  ...Object.values(SYSTEM_SUB_HEADER_CODES),
  ...Object.values(SYSTEM_ENGINE_ACCOUNT_CODES),
]);
