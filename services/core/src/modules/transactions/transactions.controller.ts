import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { EventPattern, Payload } from "@nestjs/microservices";
import { CreateTransactionDto } from "@nexous-accounting/types";

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() data: CreateTransactionDto) {
    return this.transactionsService.create(data);
  }

  @Get("id")
  findById(@Param("id") id: string) {
    return this.transactionsService.findById(id);
  }

  @EventPattern("pos.sale.completed")
  async handlePosSale(@Payload() event: any) {
    console.log({ event });

    // 1. Resolve Account Codes based on Payment Method
    // const paymentAccountCode = event.paymentMethod === 'CASH' ? '1011' : '1020';

    // // 2. Build Double-Entry Items
    // const entries = [
    //   // Revenue Leg
    //   { accountCode: paymentAccountCode, amount: event.totals.grossSales },       // +Debit Cash/Card
    //   { accountCode: '4010', amount: -event.totals.grossSales },                   // -Credit Sales Revenue

    //   // COGS / Inventory Leg
    //   { accountCode: '5010', amount: event.totals.costOfGoods },                   // +Debit COGS
    //   { accountCode: '1030', amount: -event.totals.costOfGoods },                  // -Credit Inventory Asset
    // ];

    // console.log({ entries });

    // 3. Post to General Ledger
    // await this.transactionsService.createFromExternalEvent({
    //   journalCode: 'SJ', // Sales Journal
    //   date: new Date(event.timestamp),
    //   description: `POS Checkout Order #${event.orderId}`,
    //   entries,
    // });
  }
}
