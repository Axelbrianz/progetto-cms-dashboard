import ProductModel from "../models/productsModel.js";
import type { Request, Response, NextFunction } from "express";
import { Query } from "mongoose";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import fs from "fs";

export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    const queryObject = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((el) => delete queryObject[el]);

    // 🔍 Ricerca testuale per barra di ricerca (solo nel nome)
    if (req.query.search) {
      // Creazione di un espressione regolare per la ricerca testuale (case-insensitive)
      const searchRegex = new RegExp(req.query.search as string, "i");
      queryObject.name = searchRegex as any;
    }

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query: Query<any, any> = ProductModel.find(JSON.parse(queryStr));

    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    if (req.query.fields) {
      const fields = (req.query.fields as string).split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const products = await query;

    res.status(200).json({
      status: "success",
      page: page,
      results: products.length,
      data: { products },
    });
  },
);

export const addProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      req.body.image = req.file.filename;
    }

    const newProduct = await ProductModel.create(req.body);
    res.status(201).json(newProduct);
  },
);

export const getProductById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const product = await ProductModel.findById(id).populate({
      path: "reviews",
      options: { sort: { createdAt: -1 }, limit: 5 },
      match: { rating: { $gte: 4 } },
    });

    if (!product) {
      return next(new AppError("Prodotto non trovato", 404));
    }

    res.json(product);
  },
);

export const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new AppError("ID mancante", 400));
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new AppError("Prodotto non trovato", 404));
    }

    if (deletedProduct.image) {
      const imagePath = `public/img/products/${deletedProduct.image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(
            "Errore durante la cancellazione dell'immagine del prodotto:",
            err,
          );
        } else {
          console.log(
            "Immagine del prodotto cancellata con successo:",
            imagePath,
          );
        }
      });
    }

    res.status(200).json({ message: `${deletedProduct.name} eliminato` });
  },
);

export const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new AppError("ID mancante", 400));
    }

    if (req.file) {
      const oldProduct = await ProductModel.findById(id);
      if (oldProduct && oldProduct.image) {
        const oldImagePath = `public/img/products/${oldProduct.image}`;
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error(
              "Errore durante la cancellazione della vecchia immagine del prodotto:",
              err,
            );
          } else {
            console.log(
              "Vecchia immagine del prodotto cancellata con successo:",
              oldImagePath,
            );
          }
        });
      }
      req.body.image = req.file.filename;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return next(new AppError("Prodotto non trovato", 404));
    }

    res.json(updatedProduct);
  },
);
