import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
    throw new Error('JWT_SECRET non è definito ');
}
 
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Prende il token dall'header "Bearer TOKEN"

    if (!token) return res.status(401).json({ message: 'Accesso negato, token mancante' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token non valido o scaduto' });
        
        // Salviamo i dati dell'utente nella richiesta per usarli dopo se serve
        (req as any).user = user;
        next(); // Passiamo al controller successivo (es. getAllProducts)
    });
};