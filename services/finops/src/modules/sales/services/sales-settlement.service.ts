import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ICreateEntry, ICreateSalesSettlement } from "@nexous-accounting/types";
import { PrismaService } from "src/database/prisma.service";
import { SalesLedgerService } from "./sales-ledger.service";

@Injectable()
export class SalesSettlementService {
  constructor(
    private readonly db: PrismaService,
    private readonly ledgerService: SalesLedgerService,
  ) {}

  /**
   * Handles payment settlement for a single sales invoice
   */
  async settleInvoice(invoiceId: string, dto: ICreateSalesSettlement) {
    return await this.db.$transaction(async (tx) => {
      const invoice = await tx.salesInvoice.findUnique({
        where: { id: invoiceId },
      });

      if (!invoice) {
        throw new NotFoundException(`Sales Invoice ${invoiceId} not found`);
      }

      if (invoice.status === "PAID" || invoice.unpaidAmount.toNumber() === 0) {
        throw new BadRequestException("Invoice is already fully settled");
      }

      if (dto.amount > invoice.unpaidAmount.toNumber()) {
        throw new BadRequestException(
          `Settlement amount (${dto.amount}) exceeds remaining unpaid amount (${invoice.unpaidAmount})`,
        );
      }

      const settlementDate = dto.settlementDate ?? new Date();

      // 1. Record Settlement
      const settlement = await tx.salesSettlement.create({
        data: {
          salesInvoiceId: invoice.id,
          amount: dto.amount,
          accountId: dto.accountId,
          settlementDate,
          notes: dto.notes ?? "Invoice Settlement Payment",
        },
      });

      // 2. Update Invoice Balance & Status
      const newUnpaidAmount = invoice.unpaidAmount.toNumber() - dto.amount;
      const newStatus = newUnpaidAmount === 0 ? "PAID" : "PARTIAL";

      await tx.salesInvoice.update({
        where: { id: invoice.id },
        data: {
          unpaidAmount: newUnpaidAmount,
          status: newStatus,
        },
      });

      // 3. Post Accounting Journal Entry (Debit Asset/Bank, Credit Accounts Receivable)
      const entries: ICreateEntry[] = [
        { accountId: dto.accountId, amount: dto.amount }, // Debit Deposit/Cash Account
        { accountId: invoice.accountId!, amount: -dto.amount }, // Credit AR Account
      ];

      const transactionId = await this.ledgerService.postSalesTransaction(
        "SETTLEMENT",
        entries,
        settlementDate,
      );

      // 4. Attach Transaction ID to Settlement Record
      return await tx.salesSettlement.update({
        where: { id: settlement.id },
        data: { transactionId },
      });
    });
  }

  /**
   * Handles single bulk payment settled against multiple sales invoices
   */
  // async bulkSettlement(dto: MultiInvoiceSettlementDto) {
  //   if (!dto.allocations || dto.allocations.length === 0) {
  //     throw new BadRequestException("At least one invoice allocation is required");
  //   }

  //   const totalSettlementAmount = dto.allocations.reduce((sum, item) => sum + item.amount, 0);
  //   const settlementDate = dto.settlementDate ?? new Date();

  //   return await this.db.$transaction(async (tx) => {
  //     const entries: ICreateEntry[] = [
  //       { accountId: dto.accountId, amount: totalSettlementAmount }, // Debit Total Cash/Bank
  //     ];

  //     const settlementRecords = [];

  //     for (const allocation of dto.allocations) {
  //       const invoice = await tx.salesInvoice.findUnique({
  //         where: { id: allocation.salesInvoiceId },
  //       });

  //       if (!invoice) {
  //         throw new NotFoundException(`Sales Invoice ${allocation.salesInvoiceId} not found`);
  //       }

  //       if (allocation.amount > invoice.unpaidAmount) {
  //         throw new BadRequestException(
  //           `Allocation amount (${allocation.amount}) exceeds unpaid amount (${invoice.unpaidAmount}) for Invoice ${invoice.invoiceNumber}`,
  //         );
  //       }

  //       // 1. Create Settlement Record per Invoice
  //       const settlement = await tx.salesSettlement.create({
  //         data: {
  //           salesInvoiceId: invoice.id,
  //           amount: allocation.amount,
  //           accountId: dto.accountId,
  //           settlementDate,
  //           notes: dto.notes ?? "Batch Invoice Settlement",
  //         },
  //       });

  //       // 2. Update Invoice Unpaid Balance and Status
  //       const newUnpaidAmount = invoice.unpaidAmount - allocation.amount;
  //       const newStatus = newUnpaidAmount === 0 ? "PAID" : "PARTIAL";

  //       await tx.salesInvoice.update({
  //         where: { id: invoice.id },
  //         data: {
  //           unpaidAmount: newUnpaidAmount,
  //           status: newStatus,
  //         },
  //       });

  //       // 3. Credit individual invoice AR accounts
  //       entries.push({
  //         accountId: invoice.accountId!,
  //         amount: -allocation.amount,
  //       });

  //       settlementRecords.push(settlement.id);
  //     }

  //     // 4. Post Single Consolidated Microservice Journal Entry
  //     const transactionId = await this.ledgerService.postSalesTransaction(
  //       "MULTI_SETTLEMENT",
  //       entries,
  //       settlementDate.toISOString(),
  //     );

  //     // 5. Update settlement records with transactionId
  //     await tx.salesSettlement.updateMany({
  //       where: { id: { in: settlementRecords } },
  //       data: { transactionId },
  //     });

  //     return {
  //       settlementCount: settlementRecords.length,
  //       totalAmount: totalSettlementAmount,
  //       transactionId,
  //     };
  //   });
  // }
}
