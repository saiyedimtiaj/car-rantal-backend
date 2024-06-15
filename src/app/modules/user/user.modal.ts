import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";

const userModal = new Schema<TUser>(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true, enum: ["user", "admin"] },
  },
  {
    timestamps: true,
  }
);

export const Users = model<TUser>("Users", userModal);
