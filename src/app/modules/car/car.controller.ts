import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { carServices } from "./car.service";

const createCar = catchAsync(async (req, res) => {
  const result = await carServices.craeteCarIntoDb(req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Car created successfully!",
  });
});

const getCar = catchAsync(async (req, res) => {
  const result = await carServices.getCarIntoDb();
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Cars retrieved successfully!",
  });
});

const getSingleCar = catchAsync(async (req, res) => {
  const result = await carServices.getSingleCarIntoDb(req.params.id);
  if (!result) {
    res.status(404).json({
      success: false,
      statusCode: 404,
      message: "No Data Found",
      data: [],
    });
  }
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "A Car retrieved successfully!",
  });
});

const updateCar = catchAsync(async (req, res) => {
  const result = await carServices.updateCarFromDb(req.params.id, req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Car updated successfully",
  });
});

const deleteCar = catchAsync(async (req, res) => {
  const result = await carServices.deleteCarIntodb(req.params.id);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Car Deleted successfully",
  });
});

const returnCar = catchAsync(async (req, res) => {
  const result = await carServices.carReturnFromdb(req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Car booked successfully",
  });
});

export const carController = {
  createCar,
  getCar,
  getSingleCar,
  updateCar,
  deleteCar,
  returnCar,
};
