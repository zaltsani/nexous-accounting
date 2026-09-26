import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateInvoiceDto } from "@nexous-accounting/common";
import { PrismaService } from "src/database/prisma.service";
import { SalesInvoiceCalculator } from "../domain/sales-invoice.calculator";
import { SalesInvoiceState } from "../domain/sales-invoice.state";
import { SalesLedgerService } from "./sales-ledger.service";

@Injectable()
export class SalesInvoiceService {
  constructor(
    private readonly db: PrismaService,
    private readonly ledgerService: SalesLedgerService,
  ) {}

  async createInvoice(dto: CreateInvoiceDto) {
    const {
      action,
      items,
      downPaymentAmount = 0,
      settlementAccountId,
      ...invoiceData
    } = dto as any;

    const { itemsWithSubtotal, totalAmount } = SalesInvoiceCalculator.calculateTotals(items);

    if (downPaymentAmount > totalAmount) {
      throw new BadRequestException("Down payment amount cannot exceed total invoice amount");
    }

    const { status, unpaidAmount, entries } = SalesInvoiceState.resolveState(
      dto,
      totalAmount,
      downPaymentAmount,
    );

    return await this.db.$transaction(async (tx) => {
      const invoice = await tx.salesInvoice.create({
        data: {
          ...invoiceData,
          status,
          unpaidAmount,
          totalAmount,
          items: { create: itemsWithSubtotal },
        },
      });

      const settlementAmount = dto.type === "CASH_SALE" ? totalAmount : downPaymentAmount;
      const targetAccount = dto.type === "CASH_SALE" ? dto.accountId : settlementAccountId;

      if (action === "POST" && settlementAmount > 0) {
        if (!targetAccount)
          throw new BadRequestException("Target Settlement Account ID is required");

        await tx.salesSettlement.create({
          data: {
            salesInvoiceId: invoice.id,
            amount: settlementAmount,
            accountId: targetAccount,
            settlementDate: invoice.issueDate ?? new Date(),
            notes:
              dto.type === "DOWN_PAYMENT"
                ? "Upfront Down Payment Receipt"
                : "Direct Cash Settlement",
          },
        });
      }

      if (entries && entries.length > 0) {
        const transactionDate = (invoice.issueDate ?? new Date()).toISOString();
        const transactionId = await this.ledgerService.postSalesTransaction(
          dto.type,
          entries,
          transactionDate,
        );

        await tx.salesSettlement.updateMany({
          where: { salesInvoiceId: invoice.id },
          data: { transactionId },
        });

        return await tx.salesInvoice.update({
          where: { id: invoice.id },
          data: { transactionId },
          include: { items: true, settlements: true },
        });
      }

      return invoice;
    });
  }
}
