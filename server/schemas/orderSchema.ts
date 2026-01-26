import { z } from "zod";

export const createOrderSchema = z.object({
  shippingAddress: z.object({
    street: z.string().min(1, "Via richiesta"),
    city: z.string().min(1, "Città richiesta"),
    postalCode: z.string().min(1, "CAP richiesto"),
    country: z.string().min(1, "Paese richiesto"),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
