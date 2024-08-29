import { Types } from "mongoose";

export type TBooking = {
  date: string;
  startTime: string;
  endTime: string | null;
  user: Types.ObjectId;
  car: Types.ObjectId;
  totalCost: number;
  passport: string;
  license: string;
  address: string;
  status: string;
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
