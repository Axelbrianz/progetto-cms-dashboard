import {products} from '../data/mockDb.js';

// Funzione per ottenere tutti i prodotti

export const getAllProducts = (req, res) => {
    res.json(products);
};
