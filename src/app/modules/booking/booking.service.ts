import httpStatus from "http-status";
import { Car } from "../car/car.modal";
import { Users } from "../user/user.modal";
import { TBooking, TCarBooking, TQuery } from "./booking.interface";
import { Bookings } from "./booking.model";
import { AppError } from "../../error/AppError";
import { Request } from "express";
import mongoose, { Types } from "mongoose";

const createBookingIntoDb = async (payload: TCarBooking, userEmail: string) => {
  const { carId, ...others } = payload;

  const isCarExist = await Car.findById(carId);
  if (!isCarExist || isCarExist.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Car does not exist!");
  }

  if (isCarExist.status !== "available") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Car is not available at this time!!"
    );
  }

  const bookingCars = await Bookings.findOne({
    car: new Types.ObjectId(carId),
  }).sort({ createdAt: -1 });

  if (bookingCars) {
    const carBookedEndTime = new Date(`1970-01-01T${bookingCars.endTime}:00Z`);
    const carBookRequestStartTime = new Date(
      `1970-01-01T${payload.startTime}:00Z`
    );

    if (
      bookingCars.date === payload.date &&
      carBookedEndTime >= carBookRequestStartTime
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Car is not available at this time!!"
      );
    }
  }

  const user = await Users.findOne({ email: userEmail });
  const findBooking = await Bookings.findOne({ date: payload.date }).sort({
    date: -1,
  });

  if (payload.date === findBooking?.date) {
    if (user?.email === userEmail) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You already booked at this date!"
      );
    }
  }

  const result = await Bookings.create({
    car: carId,
    ...others,
    user: user,
  });

  return result;
};

const getBookingFromDb = async (req: Request) => {
  const queryObj: TQuery = {};

  if (req.query.carId) {
    queryObj["car"] = new Types.ObjectId(req.query.carId as string);
  }

  if (req.query.date) {
    queryObj.date = req.query.date as string;
  }

  const result = await Bookings.find(queryObj)
    .populate("user")
    .populate("car")
    .sort({ createdAt: "desc" });

  return result;
};

const getMyBookingFromDb = async (email: string) => {
  const user = await Users.findOne({ email });
  const result = await Bookings.find({ user: new Types.ObjectId(user?._id) })
    .populate("user")
    .populate("car")
    .sort({ createdAt: "desc" });
  return result;
};

const approveBooking = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const isBookingExist = await Bookings.findById(id).session(session);

    if (!isBookingExist) {
      throw new AppError(httpStatus.NOT_FOUND, "Booking not found!");
    }

    if (isBookingExist.status !== "panding") {
      throw new AppError(httpStatus.BAD_REQUEST, "Already Booking changed!");
    }

    const isCarExist = await Car.findById(isBookingExist.car).session(session);

    if (!isCarExist) {
      throw new AppError(httpStatus.NOT_FOUND, "Car not found!");
    }

    const car = await Car.findByIdAndUpdate(
      isCarExist._id,
      { status: "unavailable" },
      { new: true, session }
    );

    const bookingUpdate = await Bookings.findByIdAndUpdate(
      id,
      { status: "approve" },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return { car, bookingUpdate };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const rejectBooking = async (id: string) => {
  const isBookingExist = await Bookings.findById(id);

  if (!isBookingExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found!");
  }

  if (isBookingExist.status !== "panding") {
    throw new AppError(httpStatus.BAD_REQUEST, "Already Booking changed!");
  }

  const isCarExist = await Car.findById(isBookingExist.car);

  if (!isCarExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found!");
  }

  const bookingUpdate = await Bookings.findByIdAndUpdate(
    id,
    { status: "reject" },
    { new: true }
  );

  return bookingUpdate;
};

const updateBooking = async (id: string, payload: Partial<TBooking>) => {
  const isBookingExist = await Bookings.findById(id);

  if (!isBookingExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found!");
  }

  const result = await Bookings.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const bookingService = {
  createBookingIntoDb,
  getBookingFromDb,
  getMyBookingFromDb,
  approveBooking,
  rejectBooking,
  updateBooking,
};
