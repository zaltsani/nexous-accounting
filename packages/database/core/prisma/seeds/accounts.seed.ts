import { AccountType, NormalBalance, PrismaClient } from "@nexous-accounting/database-core";
import {
  IAccount,
  SYSTEM_ENGINE_ACCOUNT_CODES,
  SYSTEM_SUB_HEADER_CODES,
  SYSTEM_ROOT_CODES,
  type AccountOperation,
  SystemAccountOperation,
} from "@nexous-accounting/types";

// -------------------------------------------------------------------
// Level 1: Root Accounts
// -------------------------------------------------------------------
export const SEED_ROOT_ACCOUNTS: IAccount[] = [
  {
    code: SYSTEM_ROOT_CODES.ASSET,
    name: "Aset",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },
  {
    code: SYSTEM_ROOT_CODES.LIABILITY,
    name: "Liabilitas",
    type: AccountType.LIABILITY,
    normalBalance: NormalBalance.CREDIT,
  },
  {
    code: SYSTEM_ROOT_CODES.EQUITY,
    name: "Ekuitas",
    type: AccountType.EQUITY,
    normalBalance: NormalBalance.CREDIT,
  },
  {
    code: SYSTEM_ROOT_CODES.REVENUE,
    name: "Pendapatan",
    type: AccountType.REVENUE,
    normalBalance: NormalBalance.CREDIT,
  },
  {
    code: SYSTEM_ROOT_CODES.EXPENSE,
    name: "Beban",
    type: AccountType.EXPENSE,
    normalBalance: NormalBalance.DEBIT,
  },
];

// -------------------------------------------------------------------
// Level 2: Neraca Sub-Headers & Categories
// -------------------------------------------------------------------
export const SEED_SUB_HEADER_ACCOUNTS: IAccount[] = [
  // --- ASET (10000) ---
  {
    code: SYSTEM_SUB_HEADER_CODES.CURRENT_ASSET,
    parentCode: SYSTEM_ROOT_CODES.ASSET,
    name: "Aset Lancar",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },
  {
    code: SYSTEM_SUB_HEADER_CODES.CASH_AND_EQUIVALENTS,
    parentCode: SYSTEM_SUB_HEADER_CODES.CURRENT_ASSET,
    name: "Kas & Setara Kas",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },
  {
    code: SYSTEM_SUB_HEADER_CODES.RECEIVABLE,
    parentCode: SYSTEM_SUB_HEADER_CODES.CURRENT_ASSET,
    name: "Piutang Usaha",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },
  {
    code: SYSTEM_SUB_HEADER_CODES.INVENTORY,
    parentCode: SYSTEM_SUB_HEADER_CODES.CURRENT_ASSET,
    name: "Persediaan",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },
  {
    code: SYSTEM_SUB_HEADER_CODES.PREPAID_TAX,
    parentCode: SYSTEM_SUB_HEADER_CODES.CURRENT_ASSET,
    name: "Pajak Dibayar Di Muka",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },

  {
    code: SYSTEM_SUB_HEADER_CODES.NON_CURRENT_ASSET,
    parentCode: SYSTEM_ROOT_CODES.ASSET,
    name: "Aset Tidak Lancar",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },
  {
    code: SYSTEM_SUB_HEADER_CODES.FIXED_ASSET,
    parentCode: SYSTEM_SUB_HEADER_CODES.NON_CURRENT_ASSET,
    name: "Aset Tetap",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },
  {
    code: SYSTEM_SUB_HEADER_CODES.ACCUMULATED_DEPRECIATION,
    parentCode: SYSTEM_SUB_HEADER_CODES.NON_CURRENT_ASSET,
    name: "Akumulasi Penyusutan",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.CREDIT,
  },

  // --- LIABILITAS (20000) ---
  {
    code: SYSTEM_SUB_HEADER_CODES.CURRENT_LIABILITY,
    parentCode: SYSTEM_ROOT_CODES.LIABILITY,
    name: "Liabilitas Jangka Pendek",
    type: AccountType.LIABILITY,
    normalBalance: NormalBalance.CREDIT,
  },
  {
    code: SYSTEM_SUB_HEADER_CODES.PAYABLE,
    parentCode: SYSTEM_SUB_HEADER_CODES.CURRENT_LIABILITY,
    name: "Utang Usaha",
    type: AccountType.LIABILITY,
    normalBalance: NormalBalance.CREDIT,
  },
  {
    code: SYSTEM_SUB_HEADER_CODES.TAX_PAYABLE,
    parentCode: SYSTEM_SUB_HEADER_CODES.CURRENT_LIABILITY,
    name: "Utang Pajak",
    type: AccountType.LIABILITY,
    normalBalance: NormalBalance.CREDIT,
  },

  {
    code: SYSTEM_SUB_HEADER_CODES.LONG_TERM_LIABILITY,
    parentCode: SYSTEM_ROOT_CODES.LIABILITY,
    name: "Liabilitas Jangka Panjang",
    type: AccountType.LIABILITY,
    normalBalance: NormalBalance.CREDIT,
  },
  {
    code: SYSTEM_SUB_HEADER_CODES.LONG_TERM_BANK_LOAN,
    parentCode: SYSTEM_SUB_HEADER_CODES.LONG_TERM_LIABILITY,
    name: "Utang Bank Jangka Panjang",
    type: AccountType.LIABILITY,
    normalBalance: NormalBalance.CREDIT,
  },

  // --- EKUITAS (30000) ---
  {
    code: SYSTEM_SUB_HEADER_CODES.OWNER_EQUITY,
    parentCode: SYSTEM_ROOT_CODES.EQUITY,
    name: "Modal Pemilik",
    type: AccountType.EQUITY,
    normalBalance: NormalBalance.CREDIT,
  },
  {
    code: SYSTEM_SUB_HEADER_CODES.RETAINED_EARNINGS,
    parentCode: SYSTEM_ROOT_CODES.EQUITY,
    name: "Saldo Laba",
    type: AccountType.EQUITY,
    normalBalance: NormalBalance.CREDIT,
  },

  // --- PENDAPATAN (40000) ---
  {
    code: SYSTEM_SUB_HEADER_CODES.OPERATIONAL_REVENUE,
    parentCode: SYSTEM_ROOT_CODES.REVENUE,
    name: "Pendapatan Operasional",
    type: AccountType.REVENUE,
    normalBalance: NormalBalance.CREDIT,
  },

  // --- BEBAN (50000) ---
  {
    code: SYSTEM_SUB_HEADER_CODES.COGS,
    parentCode: SYSTEM_ROOT_CODES.EXPENSE,
    name: "Beban Pokok Penjualan (HPP)",
    type: AccountType.EXPENSE,
    normalBalance: NormalBalance.DEBIT,
  },
  {
    code: SYSTEM_SUB_HEADER_CODES.OPERATIONAL_EXPENSE,
    parentCode: SYSTEM_ROOT_CODES.EXPENSE,
    name: "Beban Operasional",
    type: AccountType.EXPENSE,
    normalBalance: NormalBalance.DEBIT,
  },
  {
    code: SYSTEM_SUB_HEADER_CODES.DEPRECIATION_EXPENSE,
    parentCode: SYSTEM_ROOT_CODES.EXPENSE,
    name: "Beban Penyusutan",
    type: AccountType.EXPENSE,
    normalBalance: NormalBalance.DEBIT,
  },
];

// -------------------------------------------------------------------
// Level 3/4: Operational Leaf Accounts & Mappings
// -------------------------------------------------------------------
export const SEED_LEAF_ACCOUNTS: IAccount[] = [
  // Cash & Bank
  {
    code: "11101",
    parentCode: SYSTEM_SUB_HEADER_CODES.CASH_AND_EQUIVALENTS,
    name: "Kas Utama",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
    operation: SystemAccountOperation.DEFAULT_CASH,
  },

  // Sales & Receivable
  {
    code: "11201",
    parentCode: SYSTEM_SUB_HEADER_CODES.RECEIVABLE,
    name: "Piutang Usaha",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
    operation: SystemAccountOperation.DEFAULT_AR,
  },
  {
    code: "41101",
    parentCode: SYSTEM_SUB_HEADER_CODES.OPERATIONAL_REVENUE,
    name: "Pendapatan Penjualan",
    type: AccountType.REVENUE,
    normalBalance: NormalBalance.CREDIT,
    operation: SystemAccountOperation.DEFAULT_SALES,
  },

  // Purchases, Inventory & COGS
  {
    code: "11301",
    parentCode: SYSTEM_SUB_HEADER_CODES.INVENTORY,
    name: "Persediaan Barang Dagang",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
    operation: SystemAccountOperation.DEFAULT_INVENTORY,
  },
  {
    code: "21101",
    parentCode: SYSTEM_SUB_HEADER_CODES.PAYABLE,
    name: "Utang Usaha",
    type: AccountType.LIABILITY,
    normalBalance: NormalBalance.CREDIT,
    operation: SystemAccountOperation.DEFAULT_AP,
  },
  {
    code: "51101",
    parentCode: SYSTEM_SUB_HEADER_CODES.COGS,
    name: "Harga Pokok Penjualan (HPP)",
    type: AccountType.EXPENSE,
    normalBalance: NormalBalance.DEBIT,
    operation: SystemAccountOperation.DEFAULT_COGS,
  },

  // Tax Accounts
  {
    code: "11401",
    parentCode: SYSTEM_SUB_HEADER_CODES.PREPAID_TAX,
    name: "PPN Masukan (Purchase Tax)",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
    operation: SystemAccountOperation.DEFAULT_PURCHASE_TAX,
  },
  {
    code: "21201",
    parentCode: SYSTEM_SUB_HEADER_CODES.TAX_PAYABLE,
    name: "PPN Keluaran (Sales Tax)",
    type: AccountType.LIABILITY,
    normalBalance: NormalBalance.CREDIT,
    operation: SystemAccountOperation.DEFAULT_SALES_TAX,
  },

  // Fixed Assets & Depreciation
  {
    code: "12101",
    parentCode: SYSTEM_SUB_HEADER_CODES.FIXED_ASSET,
    name: "Peralatan Kantor",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },
  {
    code: "12201",
    parentCode: SYSTEM_SUB_HEADER_CODES.ACCUMULATED_DEPRECIATION,
    name: "Akumulasi Penyusutan Peralatan",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.CREDIT,
    operation: SystemAccountOperation.DEFAULT_ACCUMULATED_DEPRECIATION,
  },
  {
    code: "53101",
    parentCode: SYSTEM_SUB_HEADER_CODES.DEPRECIATION_EXPENSE,
    name: "Beban Penyusutan Peralatan",
    type: AccountType.EXPENSE,
    normalBalance: NormalBalance.DEBIT,
    operation: SystemAccountOperation.DEFAULT_DEPRECIATION_EXPENSE,
  },

  // System Math Accounts
  {
    code: "31101",
    parentCode: SYSTEM_SUB_HEADER_CODES.OWNER_EQUITY,
    name: "Modal Pemilik",
    type: AccountType.EQUITY,
    normalBalance: NormalBalance.CREDIT,
  },
  {
    code: SYSTEM_ENGINE_ACCOUNT_CODES.RETAINED_EARNINGS,
    parentCode: SYSTEM_SUB_HEADER_CODES.RETAINED_EARNINGS,
    name: "Laba Ditahan (Retained Earnings)",
    type: AccountType.EQUITY,
    normalBalance: NormalBalance.CREDIT,
    operation: SystemAccountOperation.RETAINED_EARNINGS,
  },
  {
    code: SYSTEM_ENGINE_ACCOUNT_CODES.CURRENT_YEAR_EARNINGS,
    parentCode: SYSTEM_SUB_HEADER_CODES.RETAINED_EARNINGS,
    name: "Laba Tahun Berjalan",
    type: AccountType.EQUITY,
    normalBalance: NormalBalance.CREDIT,
    operation: SystemAccountOperation.CURRENT_YEAR_EARNINGS,
  },
  {
    code: SYSTEM_ENGINE_ACCOUNT_CODES.OPENING_BALANCE_EQUITY,
    parentCode: SYSTEM_SUB_HEADER_CODES.OWNER_EQUITY,
    name: "Saldo Awal Ekuitas",
    type: AccountType.EQUITY,
    normalBalance: NormalBalance.CREDIT,
    operation: SystemAccountOperation.OPENING_BALANCE_EQUITY,
  },
];

export const ACCOUNTS_SEED_DATA = [
  ...SEED_ROOT_ACCOUNTS,
  ...SEED_SUB_HEADER_ACCOUNTS,
  ...SEED_LEAF_ACCOUNTS,
];

export async function seedAccounts(prisma: PrismaClient) {
  console.log("Seeding operational accounts and mappings...");

  const accountIdMap = new Map<string, string>();

  for (const acc of ACCOUNTS_SEED_DATA) {
    let parentId: string | undefined = undefined;

    if (acc.parentCode) {
      parentId = accountIdMap.get(acc.parentCode);
      if (!parentId) {
        const parent = await prisma.account.findUnique({ where: { code: acc.parentCode } });
        parentId = parent?.id;
      }
    }

    const createdAccount = await prisma.account.upsert({
      where: { code: acc.code },
      update: {
        name: acc.name,
        type: acc.type,
        normalBalance: acc.normalBalance,
        parentId,
      },
      create: {
        code: acc.code,
        name: acc.name,
        type: acc.type,
        normalBalance: acc.normalBalance,
        parentId,
      },
    });

    accountIdMap.set(createdAccount.code, createdAccount.id);

    // Upsert into account_mappings table if an operation is attached
    if ("operation" in acc && acc.operation) {
      await prisma.accountMapping.upsert({
        where: { operation: acc.operation as AccountOperation },
        update: {},
        create: {
          operation: acc.operation as AccountOperation,
          accountId: createdAccount.id,
        },
      });
    }
  }

  console.log("Operational accounts and mappings seeded successfully!");
}
