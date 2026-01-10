import mongoose from "mongoose";


const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Il nome del prodotto è obbligatorio'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La descrizione del prodotto è obbligatoria']
    },
    price: {
        type: Number,
        required: [true, 'Il prezzo del prodotto è obbligatorio'],
        min : [0, 'Il prezzo non può essere negativo']
    },
    category: {
        type: String,
        required: [true, 'La categoria del prodotto è obbligatoria']
    },
    inStock: {
        type: Boolean,
        default: true
    },
    howManyAvailable: {
        type: Number,
        required: [true, 'Il numero di prodotti disponibili è obbligatorio'],
        min: 0
    }
}, {
    timestamps: true
});

const ProductModel = mongoose.model('Product', productsSchema);

export default ProductModel;