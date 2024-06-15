import httpStatus from "http-status";
import { AppError } from "../../error/AppError";
import { Bookings } from "../booking/booking.model";
import { TCar, TCarReturn } from "./car.interface";
import { Car } from "./car.modal";
import mongoose from "mongoose";
import { Users } from "../user/user.modal";

const craeteCarIntoDb = async (payload: TCar) => {
  const result = await Car.create(payload);
  return result;
};

const getCarIntoDb = async () => {
  const result = await Car.find();
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
  const isBookingExist = await Bookings.findById(payload.bookingId);
  if (!isBookingExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not Exist!");
  }

  const bookingCar = await Car.findById(isBookingExist.car);
  if (!bookingCar) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not Exist!");
  }

  const startTime = new Date(`1970-01-01T${isBookingExist.startTime}:00Z`);
  const endTime = new Date(`1970-01-01T${payload.endTime}:00Z`);

  if (endTime < startTime) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "This time is not valid!");
  }

  let diff = (endTime.getTime() - startTime.getTime()) / 1000;
  diff /= 60 * 60;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const carStatusChange = await Car.findByIdAndUpdate(
      bookingCar._id,
      { status: "available" },
      {
        new: true,
        session: session,
      }
    );

    const result = await Bookings.findByIdAndUpdate(
      payload.bookingId,
      {
        endTime: payload.endTime,
        totalCost: diff * (bookingCar.pricePerHour as number),
      },
      {
        new: true,
        runValidators: true,
        session: session,
      }
    )
      .populate("user")
      .populate("car");
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const carServices = {
  craeteCarIntoDb,
  getCarIntoDb,
  getSingleCarIntoDb,
  updateCarFromDb,
  deleteCarIntodb,
  carReturnFromdb,
};
