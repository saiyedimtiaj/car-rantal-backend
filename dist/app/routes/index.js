"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const car_route_1 = require("../modules/car/car.route");
const booking_route_1 = require("../modules/booking/booking.route");
const analysis_route_1 = require("../modules/analysis/analysis.route");
const payment_route_1 = require("../modules/payment/payment.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: user_route_1.userRouter,
    },
    {
        path: "/cars",
        route: car_route_1.carRoute,
    },
    {
        path: "/bookings",
        route: booking_route_1.bookingRouter,
    },
    {
        path: "/analysis",
        route: analysis_route_1.analysisRoute,
    },
    {
        path: "/payment",
        route: payment_route_1.paymentRoute,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
