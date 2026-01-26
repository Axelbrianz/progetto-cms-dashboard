import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Nome prodotto richiesto"),
  description: z.string().min(1, "Descrizione prodotto richiesta"),
  price: z.number().positive("Prezzo prodotto non può essere negativo"),
  category: z.string().min(1, "Categoria prodotto richiesta"),
  howManyAvailable: z
    .number()
    .min(0, "Numero prodotti disponibili non può essere negativo"),
  image: z.string().optional(),
});

export const updateProductSchema = productSchema.partial();

export type CreateProductSchema = z.infer<typeof productSchema>;
