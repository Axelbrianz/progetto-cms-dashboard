import {products, type Product} from '../data/mockDb.js';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';


export const getAllProducts = (req: Request, res: Response) => {

    res.json(products);
};

export const addProduct = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user.role !== 'admin') {
        return next(new AppError('Accesso negato, permessi insufficienti', 403));
    }

    const { name, description, price, category, inStock, howManyAvailable } = req.body;

    const newProduct: Product = {
        id: products.length + 1,
        name,
        description,
        price,
        category,
        inStock,
        howManyAvailable
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
};

export const getProductById = (req: Request, res: Response, next: NextFunction) => {
     const user = (req as any).user;
    if (user.role !== 'admin') {
        return next(new AppError('Accesso negato, permessi insufficienti', 403));
    }
    const id = req.params.id;
    
    if (!id) {
       return next(new AppError('ID mancante', 400));
    }
    
    const productId = parseInt(id);
    const product = products.find(p => p.id === productId);

    if (product) {
        res.json(product);
    } else {
        return next(new AppError('Prodotto non trovato', 404));
    }
};

export const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user.role !== 'admin') {
        return next(new AppError('Accesso negato, permessi insufficienti', 403));
    }
    
    const id = req.params.id;
    if (!id) {
        return next(new AppError('ID mancante', 400));
    }

    const productId = parseInt(id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return next(new AppError('Prodotto non trovato', 404));
    }

    const deletedProduct = products[productIndex]!;  // ← ! perché sai che esiste
    products.splice(productIndex, 1);
    res.status(200).json({ message: `${deletedProduct.name} eliminato` });
};

export const updateProduct = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user.role !== 'admin') {
        return next(new AppError('Accesso negato, permessi insufficienti', 403));
    }
    
    const id = req.params.id;
    if (!id) {
        return next(new AppError('ID mancante', 400));
    }

    const productId = parseInt(id);
    const index = products.findIndex(p => p.id === productId);
    
    if (index === -1) {
        return next(new AppError('Prodotto non trovato', 404));
    }

    const product = products[index]!;  // ← ! perché sai che esiste

    const updates: Partial<Product> = {};
    const allowed: (keyof Product)[] = ['name', 'price', 'description', 'category', 'inStock', 'howManyAvailable'];

    allowed.forEach(field => {
        if (req.body[field] !== undefined) {
            (updates as any)[field] = req.body[field];
        }
    });

    const updatedProduct = { ...product, ...updates };
    products[index] = updatedProduct;
    res.json(updatedProduct);
};
