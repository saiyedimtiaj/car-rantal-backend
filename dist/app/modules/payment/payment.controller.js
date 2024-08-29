"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../error/AppError");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const booking_model_1 = require("../booking/booking.model");
const mongoose_1 = __importDefault(require("mongoose"));
const car_modal_1 = require("../car/car.modal");
const payment_1 = require("../../utils/payment");
exports.confirmationController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.query;
    const isBookingExist = yield booking_model_1.Bookings.findById(payload.bookingId);
    if (!isBookingExist || !payload.transtionId) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Booking does not exist!");
    }
    const verifyResponse = yield (0, payment_1.verifyPayment)(payload.transtionId);
    console.log(verifyResponse);
    if (isBookingExist.status === "success") {
        return res.status(http_status_1.default.OK).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Already Processed</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            text-align: center;
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #4CAF50;
            margin-bottom: 20px;
          }
          p {
            margin-bottom: 30px;
            color: #555;
          }
          .button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .button:hover {
            background-color: #45a049;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Payment Already Processed</h1>
          <p>Your payment for this booking has already been successfully processed.</p>
          <a href="/" class="button">Go to Home</a>
        </div>
      </body>
      </html>
    `);
    }
    const bookingCar = yield car_modal_1.Car.findById(isBookingExist.car);
    if (!bookingCar) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Car does not exist!");
    }
    const startTime = new Date(`1970-01-01T${isBookingExist.startTime}:00Z`);
    const endTime = new Date(`1970-01-01T${payload.endTime}:00Z`);
    if (endTime < startTime) {
        throw new AppError_1.AppError(http_status_1.default.NOT_ACCEPTABLE, "This time is not valid!");
    }
    let diff = (endTime.getTime() - startTime.getTime()) / 1000;
    diff /= 60 * 60;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        if (verifyResponse && verifyResponse.pay_status === "Successful") {
            yield car_modal_1.Car.findByIdAndUpdate(bookingCar._id, { status: "return" }, { new: true, session: session });
            const result = yield booking_model_1.Bookings.findByIdAndUpdate(payload.bookingId, {
                endTime: payload.endTime,
                totalCost: diff * bookingCar.pricePerHour,
                status: "success",
            }, {
                new: true,
                runValidators: true,
                session: session,
            })
                .populate("user")
                .populate("car");
            yield session.commitTransaction();
            yield session.endSession();
            res.status(http_status_1.default.OK).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Success</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            text-align: center;
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #4CAF50;
            margin-bottom: 20px;
          }
          p {
            margin-bottom: 30px;
            color: #555;
          }
          .button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .button:hover {
            background-color: #45a049;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Payment Successful!</h1>
          <p>Your payment was processed successfully. Thank you for your booking.</p>
          <a href="http://localhost:5173" class="button">Go to Home</a>
        </div>
      </body>
      </html>
    `);
        }
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
}));
