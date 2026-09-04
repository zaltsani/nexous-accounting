import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateInvoiceDto, CreateTransactionDto } from "@nexous-accounting/common";
import {
  ICreateEntry,
  IInvoiceStatus,
  SYSTEM_JOURNALS,
  TRANSACTION_MESSAGE_PATTERNS,
} from "@nexous-accounting/types";
import { firstValueFrom } from "rxjs";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(
    private readonly db: PrismaService,
    @Inject("NATS_SERVICE") private readonly natsClient: ClientProxy,
  ) {}

  async createInvoice(dto: CreateInvoiceDto) {
    const {
      action,
      items,
      downPaymentAmount = 0,
      settlementAccountId,
      ...invoiceData
    } = dto as any;

    const { itemsWithSubtotal, totalAmount } = this.calculateTotals(items);

    // Prevent down payment from exceeding total amount
    if (downPaymentAmount > totalAmount) {
      throw new BadRequestException("Down payment amount cannot exceed total invoice amount");
    }

    const { status, unpaidAmount, entries } = this.resolveInvoiceState(
      dto,
      totalAmount,
      downPaymentAmount,
    );

    return await this.db.$transaction(async (tx) => {
      // 1. Persist Sales Invoice & Items
      const invoice = await tx.salesInvoice.create({
        data: {
          ...invoiceData,
          status,
          unpaidAmount,
          totalAmount,
          items: { create: itemsWithSubtotal },
        },
      });

      // 2. Handle Upfront Settlement (For CASH_SALE or DOWN_PAYMENT with advance collected)
      const settlementAmount = dto.type === "CASH_SALE" ? totalAmount : downPaymentAmount;
      const targetSettlementAccount =
        dto.type === "CASH_SALE" ? dto.accountId : settlementAccountId;

      if (action === "POST" && settlementAmount > 0) {
        if (!targetSettlementAccount) {
          throw new BadRequestException("Target Settlement Account ID is required");
        }

        await tx.salesSettlement.create({
          data: {
            salesInvoiceId: invoice.id,
            amount: settlementAmount,
            accountId: targetSettlementAccount,
            settlementDate: invoice.issueDate ?? new Date(),
            notes:
              dto.type === "DOWN_PAYMENT"
                ? "Upfront Down Payment Receipt"
                : "Direct Cash Settlement",
          },
        });
      }

      // 3. Post General Ledger Entry
      if (entries && entries.length > 0) {
        const transactionDate = invoice.issueDate
          ? invoice.issueDate.toISOString()
          : new Date().toISOString();

        const transactionId = await this.postTransaction(dto.type, entries, transactionDate);

        return await tx.salesInvoice.update({
          where: { id: invoice.id },
          data: { transactionId },
          include: { items: true, settlements: true },
        });
      }

      return invoice;
    });
  }

  // ---------------------------------------------------------------------------
  // PRIVATE HELPER METHODS
  // ---------------------------------------------------------------------------

  private calculateTotals(items: CreateInvoiceDto["items"]) {
    const itemsWithSubtotal = items.map((item) => ({
      ...item,
      subtotal: item.quantity * item.unitPrice,
    }));

    const totalAmount = itemsWithSubtotal.reduce((sum, item) => sum + item.subtotal, 0);

    return { itemsWithSubtotal, totalAmount };
  }

  private resolveInvoiceState(
    dto: CreateInvoiceDto,
    totalAmount: number,
    downPaymentAmount: number,
  ) {
    const { action, type } = dto;

    if (action === "DRAFT") {
      return {
        status: "DRAFT" as IInvoiceStatus,
        unpaidAmount: totalAmount - downPaymentAmount,
        entries: undefined,
      };
    }

    this.validatePostData(dto);

    let status: IInvoiceStatus = "UNPAID";
    let unpaidAmount = totalAmount;

    if (type === "CASH_SALE") {
      status = "PAID";
      unpaidAmount = 0;
    } else if (type === "DOWN_PAYMENT") {
      unpaidAmount = totalAmount - downPaymentAmount;
      if (unpaidAmount === 0) {
        status = "PAID";
      } else if (downPaymentAmount > 0) {
        status = "PARTIAL";
      } else {
        status = "UNPAID";
      }
    } else {
      // CREDIT_SALE
      status = "UNPAID";
      unpaidAmount = totalAmount;
    }

    const entries = this.buildEntries(dto, totalAmount);

    return { status, unpaidAmount, entries };
  }

  private validatePostData(dto: CreateInvoiceDto): void {
    if (!dto.accountId) {
      throw new BadRequestException(`Account ID is required to post ${dto.type}`);
    }
  }

  private buildEntries(dto: CreateInvoiceDto, totalAmount: number): ICreateEntry[] {
    const debitEntry: ICreateEntry = {
      accountId: dto.accountId!,
      amount: totalAmount, // Debit (+) AR / Cash / Deposit Account
    };

    const creditEntries: ICreateEntry[] = dto.items.map((item) => ({
      accountId: item.revenueAccountId,
      amount: -(item.quantity * item.unitPrice), // Credit (-) Revenue / Deposit Liability
    }));

    return [debitEntry, ...creditEntries];
  }

  private async postTransaction(
    salesType: string,
    entries: ICreateEntry[],
    transactionDate: string,
  ): Promise<string> {
    try {
      const payload: CreateTransactionDto = {
        journalCode: SYSTEM_JOURNALS.SALES.code,
        date: transactionDate,
        entries,
        description: `Sales Invoice - ${salesType}`,
      };

      const transaction = await firstValueFrom(
        this.natsClient.send(TRANSACTION_MESSAGE_PATTERNS.CREATE_TRANSACTION, payload),
      );

      return transaction.id;
    } catch (error) {
      this.logger.error("Failed to post journal entry to Core Accounting microservice", error);
      throw new InternalServerErrorException(
        "Failed to process journal entry in Core Accounting. Transaction rolled back.",
      );
    }
  }
}
