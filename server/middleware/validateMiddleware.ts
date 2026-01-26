import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validateMiddleware = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const result = schema.safeParse(data);

    if (!result.success) {
      // Formatta gli errori in modo dettagliato
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

    req.body = result.data;
    next();
  };
};
