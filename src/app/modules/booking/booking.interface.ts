import { Types } from "mongoose";

export type TBooking = {
  date: string;
  startTime: string;
  endTime: string | null;
  user: Types.ObjectId;
  car: Types.ObjectId;
  totalCost: number;
};

export type TCarBooking = {
  carId: string;
  date: string;
  startTime: string;
};

export type TQuery = {
  car?: Types.ObjectId;
  date?: string;
};
