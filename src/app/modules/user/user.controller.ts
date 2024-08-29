import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";

const createUser = catchAsync(async (req, res) => {
  const result = await userServices.createUserIntoDb(req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "User registered successfully",
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { data, accessToken, refreshToken } =
    await userServices.loginUserIntoDb(req.body);
  res.cookie("refresh_token", refreshToken, {
    sameSite: "none",
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  sendResponse(res, {
    data: { data, accessToken },
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully!",
  });
});
const refreshToken = catchAsync(async (req, res) => {
  const { refresh_token } = req.cookies;
  const result = await userServices.refreshToken(refresh_token);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Access token retrive successfully!",
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userServices.getAllUsers();
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "All Users retrive successfully",
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const result = await userServices.updateUserRole(id, body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "User role change successfully",
  });
});

const getCurrentUser = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await userServices.getCurrentUser(user?.email);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "User data retrive successfully",
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await userServices.updateProfile(user?.email, req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Update profile successfully",
  });
});

export const userController = {
  createUser,
  loginUser,
  refreshToken,
  getAllUsers,
  updateUserRole,
  getCurrentUser,
  updateProfile,
};
