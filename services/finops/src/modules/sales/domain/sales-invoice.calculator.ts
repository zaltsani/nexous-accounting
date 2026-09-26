import { CreateInvoiceDto } from "@nexous-accounting/common";

export class SalesInvoiceCalculator {
  static calculateTotals(items: CreateInvoiceDto["items"]) {
    const itemsWithSubtotal = items.map((item) => ({
      ...item,
      subtotal: item.quantity * item.unitPrice,
    }));
    const totalAmount = itemsWithSubtotal.reduce((sum, item) => sum + item.subtotal, 0);
    return { itemsWithSubtotal, totalAmount };
  }
}
