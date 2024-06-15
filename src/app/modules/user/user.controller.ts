import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";

const createUser = catchAsync(async (req, res) => {
  const result = await userServices.createUserIntoDb(req.body);
  console.log(result);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "User registered successfully",
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await userServices.loginUserIntoDb(req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully!",
  });
});

export const userController = {
  createUser,
  loginUser,
};
