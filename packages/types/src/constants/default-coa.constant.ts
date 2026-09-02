// Root Header Accounts (Level 1)
export const SYSTEM_ROOT_ACCOUNTS = [
  { code: "10000", name: "Aset", type: "ASSET", normalBalance: "DEBIT" },
  { code: "20000", name: "Liabilitas", type: "LIABILITY", normalBalance: "CREDIT" },
  { code: "30000", name: "Ekuitas", type: "EQUITY", normalBalance: "CREDIT" },
  { code: "40000", name: "Pendapatan", type: "REVENUE", normalBalance: "CREDIT" },
  { code: "50000", name: "Beban", type: "EXPENSE", normalBalance: "DEBIT" },
] as const;

// Sub-Header Accounts (Level 2 - Core Classification Only)
export const SYSTEM_SUB_HEADER_ACCOUNTS = [
  // Asset Classifications
  {
    code: "11000",
    parentCode: "10000",
    name: "Aset Lancar",
    type: "ASSET",
    normalBalance: "DEBIT",
  },
  {
    code: "12000",
    parentCode: "10000",
    name: "Aset Tidak Lancar",
    type: "ASSET",
    normalBalance: "DEBIT",
  },

  // Liability Classifications
  {
    code: "21000",
    parentCode: "20000",
    name: "Liabilitas Jangka Pendek",
    type: "LIABILITY",
    normalBalance: "CREDIT",
  },
  {
    code: "22000",
    parentCode: "20000",
    name: "Liabilitas Jangka Panjang",
    type: "LIABILITY",
    normalBalance: "CREDIT",
  },
] as const;
