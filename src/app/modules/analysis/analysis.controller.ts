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

export const dashbaordAnalysisForChart = catchAsync(async (req, res) => {
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6); // Set date to 6 months ago

  // Aggregation to get bookings created in the last 6 months
  const userBookingAnalytics = await Bookings.aggregate([
    {
      // Match bookings created in the last 6 months
      $match: {
        createdAt: { $gte: sixMonthsAgo, $lte: today }, // Filter bookings within the last 6 months
      },
    },
    {
      // Group bookings by month and year, and sum up the total cost
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        count: { $sum: 1 }, // Count the number of bookings per month
        totalCost: { $sum: "$totalCost" }, // Sum up the total cost per month
      },
    },
    {
      // Sort by year and month in ascending order
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  // Create an array for the last 6 months with zero counts and total costs
  const last6Months = [];
  for (let i = 0; i < 6; i++) {
    const currentDate = new Date();
    currentDate.setMonth(today.getMonth() - i); // Subtract by month intervals

    const monthName = currentDate.toLocaleString("default", {
      month: "long",
    });

    last6Months.push({
      month: monthName,
      count: 0,
      totalCost: 0, // Default total cost
      dateKey: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`,
    });
  }

  // Map the aggregated results to the same month format
  const formattedAnalytics = userBookingAnalytics.map((item) => {
    const monthName = new Date(
      item._id.year,
      item._id.month - 1
    ).toLocaleString("default", {
      month: "long",
    });

    return {
      month: monthName,
      count: item.count,
      totalCost: item.totalCost, // Include total cost for each month
      dateKey: `${item._id.year}-${item._id.month}`,
    };
  });

  // Merge the default 6-month array with the aggregated results
  const mergedAnalytics = last6Months.map((month) => {
    const foundMonth = formattedAnalytics.find(
      (item) => item.dateKey === month.dateKey
    );
    return {
      month: month.month,
      totalCost: foundMonth ? foundMonth.totalCost.toFixed(2) : 0,
    };
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Monthly analytics data retrieval successful!",
    data: mergedAnalytics.reverse(),
  });
});

export const recentBooking = catchAsync(async (req, res) => {
  const result = await Bookings.find().sort({ createdAt: -1 });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Monthly analytics data retrieval successful!",
    data: result,
  });
});
