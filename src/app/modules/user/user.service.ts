import httpStatus from "http-status";
import config from "../../config";
import { AppError } from "../../error/AppError";
import { TLogin, TUser } from "./user.interface";
import { Users } from "./user.modal";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUserIntoDb = async (payload: TUser) => {
  const { password, ...userinfo } = payload;
  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_round);
  const result = await Users.create({ password: hashedPassword, ...userinfo });
  return result;
};

const loginUserIntoDb = async (payload: TLogin) => {
  const isUserExist = await Users.findOne({ email: payload.email });
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist!");
  }
  const matchPassword = await bcrypt.compare(
    payload.password,
    isUserExist.password
  );
  if (!matchPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
  }
  const data = {
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const token = jwt.sign(data, config.jwt_access_secret as string, {
    expiresIn: config.jwt_secret_expirein,
  });
  return { data: isUserExist, token };
};

export const userServices = {
  createUserIntoDb,
  loginUserIntoDb,
};
