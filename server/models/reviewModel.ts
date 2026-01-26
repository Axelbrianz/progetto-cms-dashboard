import mongoose, { Query } from "mongoose";
import ProductModel from "./productsModel.js";

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "la recensione non può essere vuota"],
    },
    rating: {
      type: Number,
      min: [1, "Il rating deve essere almeno 1"], // ✅ Messaggio custom
      max: [5, "Il rating non può superare 5"],
      required: [true, "vota il prodotto da 1 a 5 stelle"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "la recensione deve essere associata a un prodotto"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "la recensione deve essere associata a un utente"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Impedire recensioni duplicate da parte dello stesso utente per lo stesso prodotto
//funzionamento : crea un indice unico combinato sui campi 'product' e 'user' nel reviewSchema.
// Ciò significa che non può esistere più di una recensione con la stessa combinazione di prodotto e utente.
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Ogni volta che viene fatta una ricerca (find, findOne, ecc.)
// reviewModel.ts

// Usiamo <Query<any, any>> per dire a .pre che questo è un middleware di Query
// reviewModel.ts

reviewSchema.pre(/^find/, function (this: Query<any, any>) {
  this.populate({
    path: "user",
    select: "name",
  });
});

//Calcolo automatico media recensioni prodotto

/**
 * Static method per calcolare statistiche recensioni di un prodotto
 *
 * Utilizza MongoDB aggregation pipeline per calcolare:
 * - Numero totale recensioni (nRating)
 * - Media rating (avgRating)
 *
 * Aggiorna automaticamente il ProductModel con i risultati.
 * Chiamato dai middleware post-save e post-delete.
 */
reviewSchema.statics.calcAverageRatings = async function (
  productId: mongoose.Types.ObjectId,
) {
  const stats = await this.aggregate([
    {
      // Filtra solo le recensioni di questo prodotto
      $match: { product: productId },
    },
    {
      // Raggruppa per product e calcola statistiche
      $group: {
        _id: "$product",
        nRating: { $sum: 1 }, // Conta recensioni
        avgRating: { $avg: "$rating" }, // Media rating
      },
    },
  ]);

  if (stats.length > 0) {
    // Aggiorna il prodotto con le nuove statistiche
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    // Nessuna recensione: reset a valori default
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
// Middleware post-save: dopo aver salvato una recensione, ricalcola automaticamente
// le statistiche del prodotto (ratingsAverage e ratingsQuantity)
reviewSchema.post("save", function (this: any) {
  this.constructor.calcAverageRatings(this.product);
});

reviewSchema.post("findOneAndDelete", async function (doc: any) {
  if (doc) {
    // Si utilizza l'ID prodotto della recensione appena cancellata per ricalcolare la media
    await doc.constructor.calcAverageRatings(doc.product);
  }
});

const ReviewModel = mongoose.model("Review", reviewSchema);

export default ReviewModel;
