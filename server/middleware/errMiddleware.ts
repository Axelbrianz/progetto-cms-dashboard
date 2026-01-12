import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';
import fs from 'fs';


export const errorHandler = (err: AppError , req: Request, res: Response, next: NextFunction) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';


    //Pulizia file orfani

    if (req.file) {
        const filePath = `${req.file.path}`;
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error('Errore durante la cancellazione del file orfano:', unlinkErr);
            } else {
                console.log('File orfano cancellato con successo:', filePath);
            }
        });
    }

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