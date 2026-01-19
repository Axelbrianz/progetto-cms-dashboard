import multer from "multer";
import sharp from "sharp";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("Carica solo immagini!", 400), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const resizeProductImage = catchAsync(
  async (req: any, res: any, next: any) => {
    if (!req.file) return next();

    req.file.filename = `product-${Date.now()}.jpeg`;
    req.file.path = `public/img/products/${req.file.filename}`;

    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/products/${req.file.filename}`);

    next();
  }
);
