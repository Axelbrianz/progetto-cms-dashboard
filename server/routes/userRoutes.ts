import express from "express";
import {
  getAllUsers,
  updateMe,
  deleteMe,
  getMe,
  getUser,
  updatePassword,
} from "../controllers/userController.js";
import { authenticateToken, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Tutte le rotte da qui in poi richiedono il login
router.use(authenticateToken);

// Rotte per l'utente loggato
router.get("/me", getMe, getUser);
router.patch("/updateMe", updateMe);
router.patch("/updateMyPassword", updatePassword);
router.delete("/deleteMe", deleteMe);

// Rotte protette: solo l'Admin può vedere la lista utenti
router.use(restrictTo("admin"));
router.get("/", getAllUsers);
router.get("/:id", getUser);

export default router;
