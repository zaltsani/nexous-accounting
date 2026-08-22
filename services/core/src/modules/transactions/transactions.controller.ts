import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { TRANSACTION_MESSAGE_PATTERNS } from "@nexous-accounting/types";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto, UpdateTransactionDto } from "@nexous-accounting/common";

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern(TRANSACTION_MESSAGE_PATTERNS.CREATE_TRANSACTION)
  createTransaction(@Payload() dto: CreateTransactionDto) {
    return this.transactionsService.create(dto);
  }

  @MessagePattern(TRANSACTION_MESSAGE_PATTERNS.UPDATE_TRANSACTION)
  updateTransaction(@Payload() payload: { id: string; data: UpdateTransactionDto }) {
    return this.transactionsService.updateTransaction(payload.id, payload.data);
  }

  @MessagePattern(TRANSACTION_MESSAGE_PATTERNS.LIST_TRANSACTION)
  listTransaction() {
    return this.transactionsService.listTransaction();
  }

  @MessagePattern(TRANSACTION_MESSAGE_PATTERNS.GET_TRANSACTION)
  getTransaction(@Payload() id: string) {
    return this.transactionsService.getTransaction(id);
  }

  @MessagePattern(TRANSACTION_MESSAGE_PATTERNS.DELETE_TRANSACTION)
  deleteTransaction(@Payload() id: string) {
    return this.transactionsService.deleteTransaction(id);
  }
}
