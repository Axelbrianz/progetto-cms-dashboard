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
import { validateMiddleware } from "../middleware/validateMiddleware.js";
import {
  productSchema,
  updateProductSchema,
} from "../schemas/productSchema.js";
import reviewRoutes from "./reviewRoutes.js";
const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  authenticateToken,
  restrictTo("admin"),
  upload.single("image"),
  resizeProductImage,
  validateMiddleware(productSchema),
  addProduct,
);

router.delete("/:id", authenticateToken, restrictTo("admin"), deleteProduct);
router.patch(
  "/:id",
  authenticateToken,
  restrictTo("admin"),
  upload.single("image"),
  resizeProductImage,
  validateMiddleware(updateProductSchema),
  updateProduct,
);
router.use("/:productId/reviews", reviewRoutes);
export default router;
