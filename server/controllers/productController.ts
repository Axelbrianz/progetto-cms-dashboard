import ProductModel from '../models/productsModel.js';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getAllProducts = catchAsync(async(req: Request, res: Response) => {
    const products = await ProductModel.find();
    res.json(products);
});

export const addProduct = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user.role !== 'admin') {
        return next(new AppError('Accesso negato, permessi insufficienti', 403));
    }
    
    const createdProduct = await ProductModel.create(req.body);
    res.status(201).json(createdProduct);
});

export const getProductById = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    if (!id) {
        return next(new AppError('ID mancante', 400));
    }
    
    const product = await ProductModel.findById(id);
    
    if (!product) {
        return next(new AppError('Prodotto non trovato', 404));
    }
    
    res.json(product);
});

export const deleteProduct = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user.role !== 'admin') {
        return next(new AppError('Accesso negato, permessi insufficienti', 403));
    }
    
    const { id } = req.params;
    if (!id) {
        return next(new AppError('ID mancante', 400));
    }
    
    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    
    if (!deletedProduct) {
        return next(new AppError('Prodotto non trovato', 404));
    }
    
    res.status(200).json({ message: `${deletedProduct.name} eliminato` });
});

export const updateProduct = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user.role !== 'admin') {
        return next(new AppError('Accesso negato, permessi insufficienti', 403));
    }
    
    const { id } = req.params;
    if (!id) {
        return next(new AppError('ID mancante', 400));
    }
    
    const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
        return next(new AppError('Prodotto non trovato', 404));
    }
    
    res.json(updatedProduct);
});
