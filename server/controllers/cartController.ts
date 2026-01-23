import type { Request, Response, NextFunction } from "express";
import CartModel from "../models/cartModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const getCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      return next(new AppError("Carrello non trovato", 404));
    }
    res.status(200).json({
      status: "success",
      data: { cart },
    });
  },
);

export const addToCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Estraggo productId e quantity dal body
    const { productId, quantity = 1 } = req.body;
    // lo userId viene preso dal token
    const userId = (req as any).user.id;

    let cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      cart = await CartModel.create({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product._id.toString() === productId,
      );
      const quantityNum = Number(quantity);
      if (itemIndex > -1) {
        const existingItem = cart.items[itemIndex];
        if (existingItem) {
          existingItem.quantity += quantityNum;
        }
        if (existingItem!.quantity <= 0) {
          cart.items.splice(itemIndex, 1);
        }
      } else {
        cart.items.push({ product: productId, quantity: quantityNum }) as any;
      }

      await cart.save();
    }

    res.status(200).json({
      status: "success",
      data: { cart },
    });
  },
);

export const removeItemFromCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const userId = (req as any).user.id;

    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      return next(new AppError("Carrello non trovato", 404));
    }

    const itemToRemove = cart.items.find(
      (item) => item.product._id.toString() === productId,
    );

    if (!itemToRemove) {
      return next(new AppError("Prodotto non trovato nel carrello", 404));
    }

    cart.items = cart.items.filter(
      (item) => item.product._id.toString() !== productId,
    );

    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Prodotto rimosso dal carrello",
      removedItem: itemToRemove,
      data: { cart },
    });
  },
);

export const clearCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    const cart = await CartModel.findOneAndDelete({ user: userId });
    if (!cart) {
      return next(new AppError("Carrello non trovato", 404));
    }
    res.status(200).json({
      status: "success",
      message: "Carrello svuotato con successo",
    });
  },
);
