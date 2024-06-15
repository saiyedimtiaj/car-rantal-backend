import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { carRoute } from "../modules/car/car.route";
import { bookingRouter } from "../modules/booking/booking.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: userRouter,
  },
  {
    path: "/cars",
    route: carRoute,
  },
  {
    path: "/bookings",
    route: bookingRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
