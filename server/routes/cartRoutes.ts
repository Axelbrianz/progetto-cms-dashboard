import express from "express";
import {
  addToCart,
  getCart,
  removeItemFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/add", addToCart);
router.get("/", getCart);
router.delete("/remove/:productId", removeItemFromCart);
router.delete("/clear", clearCart);
export default router;
