import mongoose, { Document } from "mongoose";

// Interfaccia per il documento Product
export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  howManyAvailable: number;
  image: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const productsSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Il nome del prodotto è obbligatorio"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La descrizione del prodotto è obbligatoria"],
    },
    price: {
      type: Number,
      required: [true, "Il prezzo del prodotto è obbligatorio"],
      min: [0, "Il prezzo non può essere negativo"],
    },
    category: {
      type: String,
      required: [true, "La categoria del prodotto è obbligatoria"],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    howManyAvailable: {
      type: Number,
      required: [true, "Il numero di prodotti disponibili è obbligatorio"],
      min: 0,
    },
    image: {
      type: String,
      default: "default-product.jpg",
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      set: (val: number) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productsSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

const ProductModel = mongoose.model<IProduct>("Product", productsSchema);

export default ProductModel;
