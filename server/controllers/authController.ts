import type { Request, Response } from 'express';
import { users } from '../data/mockDb.js';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
    throw new Error('JWT_SECRET non è definito ');
}



export const login = (req: Request, res: Response) => {
const { email, password } = req.body;
const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
    } else {
        res.status(401).json({ message: 'Invalid email or password', user: null }); 
    }
}

