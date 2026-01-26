import express from "express";
import { login, register } from "../controllers/authController.js";
import { validateMiddleware } from "../middleware/validateMiddleware.js";
import { loginSchema, registerSchema } from "../schemas/authSchema.js";
const router = express.Router();

router.post("/login", validateMiddleware(loginSchema), login);
router.post("/register", validateMiddleware(registerSchema), register);
export default router;
