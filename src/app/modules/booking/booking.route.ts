import { Router } from "express";
import auth from "../../middleware/auth";
import { userRole } from "../user/user.constant";
import validateRequest from "../../middleware/validateRequest";
import { createBookingValidationSchema } from "./booking.validation";
import { bookingController } from "./booking.controller";

const route = Router();

route.post(
  "/",
  auth(userRole.user),
  validateRequest(createBookingValidationSchema),
  bookingController.createBooking
);

route.get("/", auth(userRole.admin), bookingController.getAllBooking);
route.get("/my-bookings", auth(userRole.user), bookingController.getMyBooking);

export const bookingRouter = route;
