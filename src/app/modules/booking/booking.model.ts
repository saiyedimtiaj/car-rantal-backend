import { Schema, model } from "mongoose";
import { TBooking } from "./booking.interface";

const bookingSchema = new Schema<TBooking>(
  {
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String || null, default: null },
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    car: { type: Schema.Types.ObjectId, required: true, ref: "Car" },
    totalCost: { type: Number, default: 0 },
    passport: { type: String, required: true },
    license: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, required: true, default: "panding" },
  },
  {
    timestamps: true,
  }
);

export const Bookings = model<TBooking>("Bookings", bookingSchema);
