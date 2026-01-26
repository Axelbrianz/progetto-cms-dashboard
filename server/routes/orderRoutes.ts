import express from "express";
import { validateMiddleware } from "../middleware/validateMiddleware.js";
import { createOrderSchema } from "../schemas/orderSchema.js";
import {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder,
} from "../controllers/orderController.js";
import { authenticateToken, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Tutte le routes richiedono autenticazione
router.use(authenticateToken);

// Routes per tutti gli utenti autenticati
router.post("/", validateMiddleware(createOrderSchema), createOrder); // Crea un ordine dal carrello
router.get("/", getAllOrders); // Ottieni ordini (admin: tutti, user: propri)
router.get("/:id", getOrder); // Ottieni un ordine specifico (verifica ownership nel controller)

// Routes solo per admin
router.patch("/:id", restrictTo("admin"), updateOrder); // Aggiorna stato ordine

export default router;
