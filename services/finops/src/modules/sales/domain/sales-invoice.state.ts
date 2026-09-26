import { BadRequestException } from "@nestjs/common";
import { CreateInvoiceDto } from "@nexous-accounting/common";
import { ICreateEntry, IInvoiceStatus } from "@nexous-accounting/types";

export class SalesInvoiceState {
  /**
   * Resolves the invoice status, unpaid amount, and required journal entries
   * based on invoice action, type, and calculated amounts.
   */
  static resolveState(
    dto: CreateInvoiceDto,
    totalAmount: number,
    downPaymentAmount: number,
  ): {
    status: IInvoiceStatus;
    unpaidAmount: number;
    entries?: ICreateEntry[];
  } {
    const { action, type } = dto;

    if (action === "DRAFT") {
      return {
        status: "DRAFT",
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

  /**
   * Validates that required payload data exists before posting an invoice.
   */
  private static validatePostData(dto: CreateInvoiceDto): void {
    if (!dto.accountId) {
      throw new BadRequestException(`Account ID is required to post ${dto.type}`);
    }
  }

  /**
   * Constructs double-entry accounting journal entries for sales posting.
   */
  private static buildEntries(dto: CreateInvoiceDto, totalAmount: number): ICreateEntry[] {
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
}
