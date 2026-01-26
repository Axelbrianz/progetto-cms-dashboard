import mongoose, { Document, Schema } from "mongoose";

// Interface per il singolo item nell'ordine
export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string; // Nome del prodotto al momento dell'ordine
  quantity: number;
  price: number; // Prezzo al momento dell'ordine (importante per storico)
}

// Interface per l'indirizzo di spedizione
export interface IShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

// Interface per il documento Order
export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: IShippingAddress;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'ordine deve essere associato a un utente"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: [true, "Il nome del prodotto è obbligatorio"],
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "La quantità deve essere almeno 1"],
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Il prezzo non può essere negativo"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Il totale non può essere negativo"],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      street: {
        type: String,
        required: [true, "L'indirizzo è obbligatorio"],
      },
      city: {
        type: String,
        required: [true, "La città è obbligatoria"],
      },
      postalCode: {
        type: String,
        required: [true, "Il CAP è obbligatorio"],
      },
      country: {
        type: String,
        required: [true, "Il paese è obbligatorio"],
        default: "Italia",
      },
    },
  },
  {
    timestamps: true, // Aggiunge automaticamente createdAt e updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Middleware per populate automatico dei prodotti quando facciamo query
orderSchema.pre(/^find/, function (this: mongoose.Query<any, any>) {
  this.populate({
    path: "items.product",
    select: "name image",
  }).populate({
    path: "user",
    select: "name email",
  });
});

const OrderModel = mongoose.model<IOrder>("Order", orderSchema);

export default OrderModel;
