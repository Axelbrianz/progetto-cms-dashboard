import express from "express";
import {
  getAllReviews,
  createReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", getAllReviews);
router.post("/", authenticateToken, createReview);
router.delete("/:id", authenticateToken, deleteReview);

export default router;
