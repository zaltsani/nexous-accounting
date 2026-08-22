// import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const paymentMethodSchema = z.enum(["CASH", "QRIS"]);

export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  unitCost: z.number().positive(),
});

export const createPosSaleSchema = z.object({
  storeId: z.string().uuid(),
  registerId: z.string().uuid(),
  paymentMethod: paymentMethodSchema,
  items: z.array(cartItemSchema).min(1),
  discountAmount: z.number().min(0).optional(),
  taxAmount: z.number().min(0).optional(),
});

export type IPaymentMethod = z.infer<typeof paymentMethodSchema>;
export type ICartItem = z.infer<typeof cartItemSchema>;
export type ICreatePosSaleInput = z.infer<typeof createPosSaleSchema>;

// export class CartItemDto extends createZodDto(cartItemSchema) {}
// export class CreatePosSaleDto extends createZodDto(createPosSaleSchema) {}
