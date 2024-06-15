import httpStatus from "http-status";
import { Car } from "../car/car.modal";
import { Users } from "../user/user.modal";
import { TBooking, TCarBooking, TQuery } from "./booking.interface";
import { Bookings } from "./booking.model";
import { AppError } from "../../error/AppError";
import { Request } from "express";
import { Types } from "mongoose";

const createBookingIntoDb = async (payload: TCarBooking, userEmail: string) => {
  const { carId, ...others } = payload;

  const isCarExist = await Car.findById(carId);
  if (!isCarExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Cor does not exist!");
  }

  const user = await Users.findOne({ email: userEmail });

  const result = await Bookings.create({
    car: isCarExist,
    ...others,
    user: user,
  });
  return result;
};

const getBookingFromDb = async (req: Request) => {
  const queryObj: TQuery = {};

  if (req.query.carId) {
    console.log(req.query.carId);
    queryObj["car"] = new Types.ObjectId(req.query.carId as string);
  }

  if (req.query.date) {
    queryObj.date = req.query.date as string;
  }

  const result = await Bookings.find(queryObj).populate("user").populate("car");

  return result;
};

const getMyBookingFromDb = async (email: string) => {
  const user = await Users.findOne({ email });
  const result = await Bookings.find({ user: new Types.ObjectId(user?._id) })
    .populate("user")
    .populate("car");
  return result;
};

export const bookingService = {
  createBookingIntoDb,
  getBookingFromDb,
  getMyBookingFromDb,
};
