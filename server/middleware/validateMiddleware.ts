import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

/**
 * Middleware generico per validazione input con Zod
 *
 * Factory function che accetta uno schema Zod e restituisce un middleware Express.
 * Utilizza safeParse() invece di parse() per evitare eccezioni e gestire errori in modo controllato.
 *
 * @param schema - Schema Zod da utilizzare per la validazione
 * @returns Middleware Express che valida req.body
 */
export const validateMiddleware = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const result = schema.safeParse(data);

    if (!result.success) {
      // Formatta gli errori in modo user-friendly per il frontend
      // Ogni errore contiene il campo specifico e un messaggio chiaro
      const errors = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        status: "error",
        message: "Dati di input non validi",
        errors: errors,
      });
    }

    // Sostituisce req.body con i dati validati e potenzialmente trasformati da Zod
    // (es: email convertita in lowercase, stringhe trimmate)
    req.body = result.data;
    next();
  };
};
