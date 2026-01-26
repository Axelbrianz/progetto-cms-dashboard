import mongoose, { Document, Schema } from "mongoose";
import type { IProduct } from "./productsModel.js";

//interfaccia per il singolo oggetto nell'array
interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

// Interfaccia per cart item popolato
interface IPopulatedCartItem {
  product: IProduct;
  quantity: number;
}

//interfaccia per il documento Carrello
interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  calculateTotalPrice(): number;
}

// Interfaccia per carrello con prodotti popolati
export interface IPopulatedCart extends Omit<ICart, "items"> {
  items: IPopulatedCartItem[];
}

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Middleware per il populate
cartSchema.pre(/^find/, function (this: mongoose.Query<any, any>) {
  this.populate({
    path: "items.product",
    select: "name price image",
  });
});

cartSchema.methods.calculateTotalPrice = function () {
  this.totalPrice = this.items.reduce(
    (total: number, item: any) =>
      total + (item.product.price || 0) * item.quantity,
    0,
  );
  return this.totalPrice;
};

cartSchema.pre("save", async function () {
  if (!this.isModified("items")) return;
  await this.populate({
    path: "items.product",
    select: "price name image",
  });
  this.calculateTotalPrice();
});

const CartModel = mongoose.model<ICart>("Cart", cartSchema);
export default CartModel;
