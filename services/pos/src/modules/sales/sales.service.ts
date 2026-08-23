import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ICreateTransaction } from "@nexous-accounting/types";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class SalesService {
  constructor(
    private readonly db: PrismaService,
    @Inject("NATS_SERVICE") private readonly natsClient: ClientProxy,
  ) {}

  async checkout(dto: any) {
    // Calculate Financial Totals
    const grossSales = dto.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    // const costOfGoods = dto.items.reduce(
    //   (sum, item) => sum + item.unitCost * item.quantity,
    //   0
    // );
    const discount = dto.discountAmount || 0;
    const tax = dto.taxAmount || 0;
    const finalAmount = grossSales - discount + tax;

    // // 2. Persist Order in Local POS Database
    // const order = await this.prisma.order.create({
    //   data: {
    //     storeId: dto.storeId,
    //     registerId: dto.registerId,
    //     paymentMethod: dto.paymentMethod,
    //     grossSales,
    //     costOfGoods,
    //     discountAmount: discount,
    //     taxAmount: tax,
    //     totalAmount: finalAmount,
    //     status: 'COMPLETED',
    //     items: {
    //       create: dto.items.map((item) => ({
    //         productId: item.productId,
    //         quantity: item.quantity,
    //         unitPrice: item.unitPrice,
    //         unitCost: item.unitCost,
    //       })),
    //     },
    //   },
    //   include: { items: true },
    // });

    // Construct NATS Payload
    const eventPayload: ICreateTransaction = {
      journalCode: "JU",
      date: new Date(),
      entries: [],
    };

    // 4. Emit Asynchronous Event to Core Accounting
    this.natsClient.emit("pos.sale.completed", eventPayload);

    return {
      message: "Checkout successful",
      // orderId: order.id,
      totalPaid: finalAmount,
    };
  }

  async getOrderById(orderId: string) {
    return [orderId];
    // const order = await this.prisma.order.findUnique({
    //   where: { id: orderId },
    //   include: { items: true },
    // });

    // if (!order) {
    //   throw new NotFoundException(`Order with ID ${orderId} not found`);
    // }

    // return order;
  }
}
