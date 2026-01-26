import type { Request, Response, NextFunction } from "express";
import OrderModel from "../models/orderModel.js";
import type { IShippingAddress, IOrderItem } from "../models/orderModel.js";
import CartModel, { type IPopulatedCart } from "../models/cartModel.js";
import ProductModel from "../models/productsModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

// createOrder - Crea un ordine dal carrello dell'utente
export const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const cart = (await CartModel.findOne({ user: userId }).populate(
      "items.product",
    )) as IPopulatedCart | null;
    if (!cart || cart.items.length === 0) {
      return next(new AppError("Il carrello è vuoto", 400));
    }

    const { shippingAddress }: { shippingAddress: IShippingAddress } = req.body;

    const orderItems: IOrderItem[] = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));
    const totalPrice = cart.totalPrice;

    // Verifica e aggiorna lo stock dei prodotti
    for (const item of cart.items) {
      const product = await ProductModel.findById(item.product._id);

      if (!product) {
        return next(
          new AppError(`Prodotto ${item.product.name} non trovato`, 404),
        );
      }

      // Verifica se c'è abbastanza stock
      if (product.howManyAvailable < item.quantity) {
        return next(
          new AppError(
            `Stock insufficiente per ${item.product.name}. Disponibili: ${product.howManyAvailable}, Richiesti: ${item.quantity}`,
            400,
          ),
        );
      }

      // Decrementa lo stock
      product.howManyAvailable -= item.quantity;

      // Aggiorna inStock se necessario
      if (product.howManyAvailable === 0) {
        product.inStock = false;
      }

      await product.save();
    }

    // Crea l'ordine
    const order = await OrderModel.create({
      user: userId,
      items: orderItems,
      totalPrice,
      shippingAddress,
      status: "pending",
    });

    // Svuota il carrello dopo aver creato l'ordine
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    // Invia la risposta
    res.status(201).json({
      status: "success",
      data: {
        order,
      },
    });
  },
);

// getAllOrders - Ottieni tutti gli ordini (admin: tutti, user: solo i propri)
export const getAllOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    // Se l'utente è admin, mostra tutti gli ordini, altrimenti solo i suoi
    const filter = user.role === "admin" ? {} : { user: user.id };

    const orders = await OrderModel.find(filter).sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: {
        orders,
      },
    });
  },
);

// getOrder - Ottieni un singolo ordine per ID
export const getOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = (req as any).user;

    const order = await OrderModel.findById(id);

    if (!order) {
      return next(new AppError("Ordine non trovato", 404));
    }

    // Verifica che l'utente possa accedere a questo ordine
    // Admin può vederli tutti, user solo i propri
    if (user.role !== "admin" && order.user.toString() !== user.id) {
      return next(
        new AppError("Non sei autorizzato a visualizzare questo ordine", 403),
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  },
);

// updateOrder - Aggiorna lo stato di un ordine (solo admin)
export const updateOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    // Valida lo status
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!status || !validStatuses.includes(status)) {
      return next(
        new AppError(
          `Status non valido. Valori ammessi: ${validStatuses.join(", ")}`,
          400,
        ),
      );
    }

    const order = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!order) {
      return next(new AppError("Ordine non trovato", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  },
);
