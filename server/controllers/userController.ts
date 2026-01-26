import UserModel from "../models/userModel.js";
import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";

const filterObj = (obj: Record<string, any>, ...allowedFields: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  req.params.id = (req as any).user.id;
  next();
};

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findById(req.params.id).populate({
      path: "reviews",
      options: {
        sort: { createdAt: -1 },
        limit: 5,
      },
    });

    if (!user) {
      return next(new AppError("Utente non trovato", 404));
    }

    res.status(200).json({
      status: "success",
      data: { user },
    });
  },
);

/**
 * AGGIORNARE IL PROFILO (Nome ed Email)
 */
export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Errore se l'utente prova a cambiare password qui (serve una rotta dedicata)
    if (req.body.password) {
      return next(
        new AppError(
          "Questa rotta non è per le password. Usa /updateMyPassword",
          400,
        ),
      );
    }

    // 2. Filtriamo il body: permettiamo solo nome ed email
    // Anche se l'utente invia "role: admin", filterObj lo scarterà.
    const filteredBody = filterObj(req.body, "name", "email");

    const updatedUser = await UserModel.findByIdAndUpdate(
      (req as any).user.id,
      filteredBody,
      {
        new: true, // Restituisce l'utente aggiornato
        runValidators: true, // Controlla che la nuova email sia valida
      },
    );

    res.status(200).json({
      status: "success",
      data: { user: updatedUser },
    });
  },
);

// DISATTIVARE L'ACCOUNT (Soft Delete)
//Non cancelliamo l'utente dal database, lo rendiamo solo "inattivo".

export const deleteMe = catchAsync(async (req: any, res: any, next: any) => {
  await UserModel.findByIdAndUpdate(req.user.id, { active: false });

  // 204 significa "Successo, ma non invio contenuto"
  res.status(204).json({
    status: "success",
    data: null,
  });
});

/**
 * ADMIN: Vedere tutti gli utenti
 */
export const getAllUsers = catchAsync(async (req: any, res: any) => {
  const users = await UserModel.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findById((req as any).user.id).select(
      "+password",
    );

    if (!user) {
      return next(new AppError("Utente non trovato", 404));
    }

    if (
      !(await user.correctPassword(req.body.currentPassword, user.password))
    ) {
      return next(new AppError("La password attuale non è corretta", 401));
    }
    user.password = req.body.password;
    await user.save();

    const SECRET_KEY = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY!,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      status: "success",
      token,
      data: { user },
    });
  },
);
