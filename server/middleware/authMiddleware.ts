import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
    throw new Error('JWT_SECRET non è definito ');
}
 
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Prende il token dall'header "Bearer TOKEN"

    if (!token) return next(new AppError('Token mancante', 401));

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return next(new AppError('Token non valido o scaduto', 403));
        
        // Salviamo i dati dell'utente nella richiesta per usarli dopo se serve
        (req as any).user = user;
        next(); // Passiamo al controller successivo (es. getAllProducts)
    });
};