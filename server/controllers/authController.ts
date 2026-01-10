import type { Request, Response, NextFunction } from 'express';
import { users } from '../data/mockDb.js';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
    throw new Error('JWT_SECRET non è definito ');
}

export const login = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
const { email, password } = req.body;
if (!email || !password) {
    return next(new AppError('Email e password sono obbligatorie', 400));
}
const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
    } else {
        return next (new AppError('Credenziali non valide', 401)); 
    }
}
);

