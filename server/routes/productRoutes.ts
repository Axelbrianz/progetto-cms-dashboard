import express from 'express';
import { getAllProducts } from '../controllers/productController.js';
import { addProduct } from '../controllers/productController.js';
import { getProductById } from '../controllers/productController.js';
import { deleteProduct } from '../controllers/productController.js';
import { updateProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/products', getAllProducts);
router.post('/products', addProduct);
router.get('/products/:id', getProductById);
router.delete('/products/:id', deleteProduct);
router.put('/products/:id', updateProduct);


export default router;