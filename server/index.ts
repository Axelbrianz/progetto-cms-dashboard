import "dotenv/config";
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import { AppError } from "./utils/AppError.js";
import type { Request, Response, NextFunction } from "express";
import { errorHandler } from "./middleware/errMiddleware.js";
import { authenticateToken, restrictTo } from "./middleware/authMiddleware.js";
import mongoose from "mongoose";

const app = express();
app.set("query parser", "extended");
const PORT = process.env.PORT;
const DB = process.env.URL_CONNECTION;
if (!DB) {
  throw new Error("stringa di connessione mancante in .env");
}

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connessione al database avvenuta con successo");
  })
  .catch((err) => {
    console.error("Errore di connessione al database:", err);
  });

// Middleware
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
// Solo admin può vedere TUTTE le reviews
app.use("/api/reviews", authenticateToken, restrictTo("admin"), reviewRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(
      `La risorsa ${req.originalUrl} non è stata trovata sul server`,
      404,
    ),
  );
});
app.use(errorHandler);
// Avvio del server

app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
});
