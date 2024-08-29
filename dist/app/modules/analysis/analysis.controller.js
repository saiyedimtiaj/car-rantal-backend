"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashbaordAnalysis = exports.weeklyAnalysis = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const booking_model_1 = require("../booking/booking.model");
const car_modal_1 = require("../car/car.modal");
exports.weeklyAnalysis = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const weeklyData = yield booking_model_1.Bookings.aggregate([
        {
            $group: {
                _id: { $dayOfWeek: "$createdAt" },
                count: { $sum: 1 },
                totalCost: { $sum: "$totalCost" },
            },
        },
    ]);
    (0, sendResponse_1.default)(res, {
        data: weeklyData,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Weekly data retrive successfully",
    });
}));
exports.dashbaordAnalysis = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const revenueData = yield booking_model_1.Bookings.aggregate([
        {
            $group: {
                _id: null, // No grouping, so the result is a single document
                totalRevenue: { $sum: "$totalCost" }, // Summing up the totalCost field
            },
        },
    ]);
    const revenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    const bookings = yield booking_model_1.Bookings.estimatedDocumentCount();
    const available = yield (yield car_modal_1.Car.find({ isDeleted: false })).length;
    (0, sendResponse_1.default)(res, {
        data: {
            revenue,
            bookings,
            available,
        },
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Dashboard data retrive successfully",
    });
}));
