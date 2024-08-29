import { Router } from "express";
import auth from "../../middleware/auth";
import { userRole } from "../user/user.constant";
import validateRequest from "../../middleware/validateRequest";
import { createBookingValidationSchema } from "./booking.validation";
import { bookingController } from "./booking.controller";

const route = Router();

route.post(
  "/",
  auth(userRole.user, userRole.admin),
  validateRequest(createBookingValidationSchema),
  bookingController.createBooking
);

route.get("/", auth(userRole.admin), bookingController.getAllBooking);

route.get(
  "/my-bookings",
  auth(userRole.user, userRole.admin),
  bookingController.getMyBooking
);

route.patch(
  "/booking-approve/:id",
  auth(userRole.admin),
  bookingController.bookingApprove
);
route.patch(
  "/booking-reject/:id",
  auth(userRole.user, userRole.admin),
  bookingController.bookingReject
);

route.put(
  "/update/:id",
  auth(userRole.user, userRole.admin),
  bookingController.updateBooking
);

export const bookingRouter = route;
