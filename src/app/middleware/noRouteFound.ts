import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const noRouteFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found !",
    error: "",
  });
};

export default noRouteFound;
