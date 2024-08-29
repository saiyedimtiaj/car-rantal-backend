import httpStatus from "http-status";
import { AppError } from "../../error/AppError";
import catchAsync from "../../utils/catchAsync";
import { Bookings } from "../booking/booking.model";
import mongoose from "mongoose";
import { Car } from "../car/car.modal";
import { verifyPayment } from "../../utils/payment";

export const confirmationController = catchAsync(async (req, res) => {
  const payload = req.query;

  const isBookingExist = await Bookings.findById(payload.bookingId);
  if (!isBookingExist || !payload.transtionId) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking does not exist!");
  }

  const verifyResponse = await verifyPayment(payload.transtionId as string);
  console.log(verifyResponse);

  if (isBookingExist.status === "success") {
    return res.status(httpStatus.OK).send(`
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

  const bookingCar = await Car.findById(isBookingExist.car);
  if (!bookingCar) {
    throw new AppError(httpStatus.NOT_FOUND, "Car does not exist!");
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

    if (verifyResponse && verifyResponse.pay_status === "Successful") {
      await Car.findByIdAndUpdate(
        bookingCar._id,
        { status: "return" },
        { new: true, session: session }
      );

      const result = await Bookings.findByIdAndUpdate(
        payload.bookingId,
        {
          endTime: payload.endTime,
          totalCost: diff * (bookingCar.pricePerHour as number),
          status: "success",
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

      res.status(httpStatus.OK).send(`
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
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
});
