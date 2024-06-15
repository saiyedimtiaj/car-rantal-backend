import { Schema, model } from "mongoose";
import { TBooking } from "./booking.interface";

const bookingSchema = new Schema<TBooking>({
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String || null, default: null },
  user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  car: { type: Schema.Types.ObjectId, required: true, ref: "Car" },
  totalCost: { type: Number, default: 0 },
});

export const Bookings = model<TBooking>("Bookings", bookingSchema);
