import { Body, Controller, Param } from "@nestjs/common";
import { SalesService } from "./sales.service";

@Controller("sales")
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  async checkout(@Body() dto: any) {
    return this.salesService.checkout(dto);
  }

  async getOrder(@Param("id") id: string) {
    return this.salesService.getOrderById(id);
  }
}
