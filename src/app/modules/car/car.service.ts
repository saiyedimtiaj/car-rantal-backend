import httpStatus from "http-status";
import { AppError } from "../../error/AppError";
import { Bookings } from "../booking/booking.model";
import { TCar, TCarQueryParams, TCarReturn } from "./car.interface";
import { Car } from "./car.modal";
import mongoose from "mongoose";
import { initiatePayment } from "../../utils/payment";

const craeteCarIntoDb = async (payload: TCar) => {
  const result = await Car.create(payload);
  return result;
};

const getCarIntoDb = async (queryParams: TCarQueryParams) => {
  const { category, color, searchTrams, location, startDate } = queryParams;
  const query: any = {};
  if (category) {
    query.category = category;
  }
  if (color) {
    query.color = color;
  }

  if (searchTrams) {
    query.$or = [
      { name: { $regex: searchTrams, $options: "i" } },
      { description: { $regex: searchTrams, $options: "i" } },
    ];
  }

  if (location) {
    query.location = location;
  }

  if (startDate) {
    const notAvailableCars = await Bookings.find({ date: startDate });
    const bookedCarIds = notAvailableCars.map((car) => car.car);
    query._id = { $nin: bookedCarIds };
  }

  const result = await Car.find(query);
  return result;
};

const getSingleCarIntoDb = async (id: string) => {
  const result = await Car.findById(id);
  return result;
};

const updateCarFromDb = async (id: string, payload: Partial<TCar>) => {
  const result = await Car.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteCarIntodb = async (id: string) => {
  const result = await Car.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
      runValidators: true,
    }
  );
  return result;
};

const carReturnFromdb = async (payload: TCarReturn) => {
  const paymentData = {
    id: `TXN-${Date.now()}`,
    amount: 500,
    name: "Saiyed",
    email: "saiyed@gmail.com",
    bookingId: payload.bookingId,
    endTime: payload.endTime,
  };
  const paymentSession = await initiatePayment(paymentData);
  return paymentSession;
};

const manageCar = async () => {
  const result = await Car.find({ status: { $ne: "available" } });
  return result;
};

const carBack = async (id: string) => {
  const result = await Car.findByIdAndUpdate(
    id,
    { status: "available" },
    {
      new: true,
      runValidators: true,
    }
  );
  return result;
};

export const carServices = {
  craeteCarIntoDb,
  getCarIntoDb,
  getSingleCarIntoDb,
  updateCarFromDb,
  deleteCarIntodb,
  carReturnFromdb,
  manageCar,
  carBack,
};
