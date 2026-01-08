import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';


export const errorHandler = (err: AppError , req: Request, res: Response, next: NextFunction) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Errori operazionali → mostra messaggio reale
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    } 
    // Errori non operazionali → nascondi dettagli solo in production
    else {
        console.error('💥 ERRORE NON OPERAZIONALE:', err);
        res.status(err.statusCode).json({
            status: err.status,
            message: process.env.NODE_ENV === 'production' 
                ? 'Errore interno del server' 
                : err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
}