import ReviewModel from "../models/reviewModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  let filter: any = {};
  if (req.params.productId) filter.product = req.params.productId;
  if (req.query.userId) filter.user = req.query.userId;
  if (req.query.rating) filter.rating = req.query.rating;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const reviews = await ReviewModel.find(filter)
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
});

export const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.product) req.body.product = req.params.productId;
    req.body.user = (req as any).user.id;

    const newReview = await ReviewModel.create(req.body);

    res.status(201).json({
      status: "success",
      data: { review: newReview },
    });
  },
);

export const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await ReviewModel.findById(req.params.id);
    if (!review) {
      return next(new AppError("Recensione non trovata", 404));
    }

    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const isOwner = review.user.equals(userId);
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
      return next(
        new AppError("Non hai i permessi per eliminare questa recensione", 403),
      );
    }

    const deletedReview = await ReviewModel.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return next(new AppError("Recensione non trovata", 404));
    }

    res.status(200).json({
      status: "success",
      data: { review: deletedReview },
    });
  },
);
