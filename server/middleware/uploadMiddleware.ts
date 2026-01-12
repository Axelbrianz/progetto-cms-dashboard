import multer from 'multer';
import { AppError } from '../utils/AppError.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/img/products'),
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];  
        cb(null, `product-${Date.now()}.${ext}`);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image')) cb(null, true);
    else cb(new AppError('Carica solo immagini!', 400), false);
};

const limits = { fileSize: 5 * 1024 * 1024 };

export const upload = multer({ storage, fileFilter, limits });