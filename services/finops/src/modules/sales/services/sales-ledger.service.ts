import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateTransactionDto } from "@nexous-accounting/common";
import {
  ICreateEntry,
  SYSTEM_JOURNALS,
  TRANSACTION_MESSAGE_PATTERNS,
} from "@nexous-accounting/types";
import { firstValueFrom } from "rxjs";

@Injectable()
export class SalesLedgerService {
  private readonly logger = new Logger(SalesLedgerService.name);

  constructor(@Inject("NATS_SERVICE") private readonly natsClient: ClientProxy) {}

  async postSalesTransaction(
    salesType: string,
    entries: ICreateEntry[],
    date: string,
  ): Promise<string> {
    try {
      const payload: CreateTransactionDto = {
        journalCode: SYSTEM_JOURNALS.SALES.code,
        date,
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
