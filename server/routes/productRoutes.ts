import express from "express";
import { getAllProducts } from "../controllers/productController.js";
import { addProduct } from "../controllers/productController.js";
import { getProductById } from "../controllers/productController.js";
import { deleteProduct } from "../controllers/productController.js";
import { updateProduct } from "../controllers/productController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { resizeProductImage } from "../middleware/uploadMiddleware.js";
import reviewRoutes from "./reviewRoutes.js";
const router = express.Router();

router.get("/products", getAllProducts);
router.post(
  "/products",
  authenticateToken,
  restrictTo("admin"),
  upload.single("image"),
  resizeProductImage,
  addProduct
);
router.get("/products/:id", authenticateToken, getProductById);
router.delete(
  "/products/:id",
  authenticateToken,
  restrictTo("admin"),
  deleteProduct
);
router.put(
  "/products/:id",
  authenticateToken,
  restrictTo("admin"),
  upload.single("image"),
  resizeProductImage,
  updateProduct
);
router.use("/products/:productId/reviews", reviewRoutes);
export default router;
