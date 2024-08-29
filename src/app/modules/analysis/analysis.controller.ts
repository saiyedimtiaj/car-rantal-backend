import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Bookings } from "../booking/booking.model";
import { Car } from "../car/car.modal";

export const weeklyAnalysis = catchAsync(async (req, res) => {
  const weeklyData = await Bookings.aggregate([
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        count: { $sum: 1 },
        totalCost: { $sum: "$totalCost" },
      },
    },
  ]);
  sendResponse(res, {
    data: weeklyData,
    success: true,
    statusCode: httpStatus.OK,
    message: "Weekly data retrive successfully",
  });
});

export const dashbaordAnalysis = catchAsync(async (req, res) => {
  const revenueData = await Bookings.aggregate([
    {
      $group: {
        _id: null, // No grouping, so the result is a single document
        totalRevenue: { $sum: "$totalCost" }, // Summing up the totalCost field
      },
    },
  ]);

  const revenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
  const bookings = await Bookings.estimatedDocumentCount();
  const available = await (await Car.find({ isDeleted: false })).length;
  sendResponse(res, {
    data: {
      revenue,
      bookings,
      available,
    },
    success: true,
    statusCode: httpStatus.OK,
    message: "Dashboard data retrive successfully",
  });
});
