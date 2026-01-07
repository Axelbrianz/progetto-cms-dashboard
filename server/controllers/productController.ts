import {products, type Product} from '../data/mockDb.js';
import type { Request, Response } from 'express';

export const getAllProducts = (req: Request, res: Response) => {

    res.json(products);
};

export const addProduct = (req: Request, res: Response) => {
    const user = (req as any).user;
    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accesso negato, permessi insufficienti' });
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

export const getProductById = (req: Request, res: Response) => {
     const user = (req as any).user;
    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accesso negato, permessi insufficienti' });
    }
    const id = req.params.id;
    
    if (!id) {
        res.status(400).json({ message: 'ID mancante' });
        return;
    }
    
    const productId = parseInt(id);
    const product = products.find(p => p.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Prodotto non trovato' });
    }
};

export const deleteProduct = (req: Request, res: Response) => {
     const user = (req as any).user;
    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accesso negato, permessi insufficienti' });
    }
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ message: 'ID mancante' });
        return;
    }

    const productId = parseInt(id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        res.status(404).json({ message: 'Prodotto non trovato' });
        return;
    }

    const deletedProduct = products[productIndex];
    
    if (!deletedProduct) {
        res.status(404).json({ message: 'Prodotto non trovato' });
        return;
    }

    products.splice(productIndex, 1);
    res.status(200).json({ message: `${deletedProduct.name} eliminato` });
};

export const updateProduct = (req: Request, res: Response) => {
        const user = (req as any).user;
    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accesso negato, permessi insufficienti' });
    }
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ message: 'ID mancante' });
        return;
    }

    const productId = parseInt(id);
    const index = products.findIndex(p => p.id === productId);
    
    if (index === -1) {
        res.status(404).json({ message: 'Prodotto non trovato' });
        return;
    }

    const product = products[index];
    if (!product) {
        res.status(404).json({ message: 'Prodotto non trovato' });
        return;
    }

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
