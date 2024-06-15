import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bookingService } from "./booking.service";
import { TQuery } from "./booking.interface";
import { Model, Types } from "mongoose";

const createBooking = catchAsync(async (req, res) => {
  const { email } = req.user;
  const result = await bookingService.createBookingIntoDb(req.body, email);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Car booked successfully",
  });
});

const getAllBooking = catchAsync(async (req, res) => {
  const result = await bookingService.getBookingFromDb(req);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings retrieved successfully",
  });
});

const getMyBooking = catchAsync(async (req, res) => {
  const email = req.user.email;
  const result = await bookingService.getMyBookingFromDb(email);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "My Bookings retrieved successfully",
  });
});

export const bookingController = {
  createBooking,
  getAllBooking,
  getMyBooking,
};
