import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import { AppError } from "../error/AppError";
import catchAsync from "../utils/catchAsync";
import config from "../config";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

const auth = (requiredRole?: string) => {
  return catchAsync(async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route"
      );
    }
    const decoded = jwt.verify(token, config.jwt_access_secret as string);
    const { role } = decoded as JwtPayload;

    if (requiredRole && requiredRole !== role) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route"
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
