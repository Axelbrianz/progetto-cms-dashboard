import express from 'express';
import { getAllProducts } from '../controllers/productController.js';
import { addProduct } from '../controllers/productController.js';
import { getProductById } from '../controllers/productController.js';
import { deleteProduct } from '../controllers/productController.js';
import { updateProduct } from '../controllers/productController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
const router = express.Router();

router.get('/products', getAllProducts);
router.post('/products', authenticateToken, upload.single('image'), addProduct);
router.get('/products/:id', authenticateToken, getProductById);
router.delete('/products/:id', authenticateToken, deleteProduct);
router.put('/products/:id', authenticateToken, upload.single('image'), updateProduct);

export default router;