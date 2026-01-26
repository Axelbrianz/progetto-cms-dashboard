import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET non è definito ");
}

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("Credenziali non valide", 401));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError("Credenziali non valide", 401));
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      status: "success",
      token,
      data: { user },
    });
  },
);

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return next(new AppError("Utente già registrato con questa email", 409));
    }
    const newUser = await UserModel.create({
      name: name,
      email: email,
      password: password,
      role: "user",
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      SECRET_KEY,
      { expiresIn: "1h" },
    );

    res.status(201).json({
      status: "success",
      token,
      data: { user: newUser },
    });
  },
);
