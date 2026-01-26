import express from "express";
import {
  getAllReviews,
  createReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

// Route pubblica per reviews di un prodotto specifico (tramite /products/:id/reviews)
// Route admin per vedere tutte le reviews (tramite /reviews)
router.get("/", getAllReviews);
router.post("/", authenticateToken, createReview);
router.delete("/:id", authenticateToken, deleteReview);

export default router;
