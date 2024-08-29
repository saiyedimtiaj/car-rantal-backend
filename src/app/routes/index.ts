import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { carRoute } from "../modules/car/car.route";
import { bookingRouter } from "../modules/booking/booking.route";
import { analysisRoute } from "../modules/analysis/analysis.route";
import { paymentRoute } from "../modules/payment/payment.route";

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
  {
    path: "/analysis",
    route: analysisRoute,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
