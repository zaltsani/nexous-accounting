-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "core";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "inventory";

-- CreateEnum
CREATE TYPE "core"."NormalBalance" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "core"."AccountType" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "inventory"."StockMovementType" AS ENUM ('PURCHASE', 'SALE', 'ADJUSTMENT', 'RETURN_IN', 'RETURN_OUT');

-- CreateTable
CREATE TABLE "core"."accounts" (
    "id" TEXT NOT NULL,
    "parent_id" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "core"."AccountType" NOT NULL,
    "normal_balance" "core"."NormalBalance" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."journals" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."transactions" (
    "id" TEXT NOT NULL,
    "journal_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."entries" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "amount" DECIMAL(18,4) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."products" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "barcode" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT NOT NULL,
    "price" DECIMAL(18,4) NOT NULL,
    "inventory_account_id" TEXT NOT NULL,
    "cogs_account_id" TEXT NOT NULL,
    "sales_account_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."inventory_batches" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "unit_cost" DECIMAL(18,4) NOT NULL,
    "initial_qty" DECIMAL(18,4) NOT NULL,
    "remaining_qty" DECIMAL(18,4) NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."stock_movements" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "batch_id" TEXT,
    "transaction_id" TEXT,
    "type" "inventory"."StockMovementType" NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "unit_cost" DECIMAL(18,4) NOT NULL,
    "total_value" DECIMAL(18,4) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_code_key" ON "core"."accounts"("code");

-- CreateIndex
CREATE INDEX "accounts_parent_id_idx" ON "core"."accounts"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "journals_code_key" ON "core"."journals"("code");

-- CreateIndex
CREATE INDEX "transactions_journal_id_date_idx" ON "core"."transactions"("journal_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "inventory"."products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "products_barcode_key" ON "inventory"."products"("barcode");

-- CreateIndex
CREATE INDEX "products_inventory_account_id_idx" ON "inventory"."products"("inventory_account_id");

-- CreateIndex
CREATE INDEX "products_cogs_account_id_idx" ON "inventory"."products"("cogs_account_id");

-- CreateIndex
CREATE INDEX "products_sales_account_id_idx" ON "inventory"."products"("sales_account_id");

-- CreateIndex
CREATE INDEX "inventory_batches_product_id_remaining_qty_idx" ON "inventory"."inventory_batches"("product_id", "remaining_qty");

-- CreateIndex
CREATE INDEX "stock_movements_product_id_idx" ON "inventory"."stock_movements"("product_id");

-- CreateIndex
CREATE INDEX "stock_movements_batch_id_idx" ON "inventory"."stock_movements"("batch_id");

-- CreateIndex
CREATE INDEX "stock_movements_transaction_id_idx" ON "inventory"."stock_movements"("transaction_id");

-- AddForeignKey
ALTER TABLE "core"."accounts" ADD CONSTRAINT "accounts_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "core"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."transactions" ADD CONSTRAINT "transactions_journal_id_fkey" FOREIGN KEY ("journal_id") REFERENCES "core"."journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."entries" ADD CONSTRAINT "entries_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "core"."transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."entries" ADD CONSTRAINT "entries_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "core"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."products" ADD CONSTRAINT "products_inventory_account_id_fkey" FOREIGN KEY ("inventory_account_id") REFERENCES "core"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."products" ADD CONSTRAINT "products_cogs_account_id_fkey" FOREIGN KEY ("cogs_account_id") REFERENCES "core"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."products" ADD CONSTRAINT "products_sales_account_id_fkey" FOREIGN KEY ("sales_account_id") REFERENCES "core"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."inventory_batches" ADD CONSTRAINT "inventory_batches_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "inventory"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."stock_movements" ADD CONSTRAINT "stock_movements_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "inventory"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."stock_movements" ADD CONSTRAINT "stock_movements_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "inventory"."inventory_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."stock_movements" ADD CONSTRAINT "stock_movements_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "core"."transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
