import mongoose from "mongoose";
import type { Document } from "mongoose";
import validator from "validator"; // Utile per validare le email
import bcrypt from "bcryptjs";

interface IUser extends Document {
  name: string;
  email: string;
  role: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Per favore, inserisci il tuo nome"],
  },
  email: {
    type: String,
    required: [true, "Per favore, inserisci la tua email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Inserisci una email valida"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Inserisci una password"],
    minlength: 8,
    select: false,
  },
});

userSchema.set("toJSON", {
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret.password;
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

userSchema.pre<IUser>("save", async function (this: IUser) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
