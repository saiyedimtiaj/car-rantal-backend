"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const booking_validation_1 = require("./booking.validation");
const booking_controller_1 = require("./booking.controller");
const route = (0, express_1.Router)();
route.post("/", (0, auth_1.default)(user_constant_1.userRole.user), (0, validateRequest_1.default)(booking_validation_1.createBookingValidationSchema), booking_controller_1.bookingController.createBooking);
route.get("/", (0, auth_1.default)(user_constant_1.userRole.admin), booking_controller_1.bookingController.getAllBooking);
route.get("/my-bookings", (0, auth_1.default)(user_constant_1.userRole.user), booking_controller_1.bookingController.getMyBooking);
exports.bookingRouter = route;
