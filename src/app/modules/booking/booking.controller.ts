import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bookingService } from "./booking.service";

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

const bookingApprove = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await bookingService.approveBooking(id);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking Approve successfully",
  });
});

const bookingReject = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await bookingService.rejectBooking(id);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking is Rejected",
  });
});

const updateBooking = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await bookingService.updateBooking(id, req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking date and time modified!",
  });
});

export const bookingController = {
  createBooking,
  getAllBooking,
  getMyBooking,
  bookingApprove,
  bookingReject,
  updateBooking,
};
