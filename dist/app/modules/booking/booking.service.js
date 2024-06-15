"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const car_modal_1 = require("../car/car.modal");
const user_modal_1 = require("../user/user.modal");
const booking_model_1 = require("./booking.model");
const AppError_1 = require("../../error/AppError");
const mongoose_1 = __importStar(require("mongoose"));
const createBookingIntoDb = (payload, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const { carId } = payload, others = __rest(payload, ["carId"]);
    const isCarExist = yield car_modal_1.Car.findById(carId);
    if (!isCarExist || isCarExist.isDeleted) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Car does not exist!");
    }
    if (isCarExist.status === "unavailable") {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Car is not available at this time!!");
    }
    const bookingCars = yield booking_model_1.Bookings.findOne({
        car: new mongoose_1.Types.ObjectId(carId),
    }).sort({ createdAt: -1 });
    if (bookingCars) {
        const carBookedEndTime = new Date(`1970-01-01T${bookingCars.endTime}:00Z`);
        const carBookRequestStartTime = new Date(`1970-01-01T${payload.startTime}:00Z`);
        if (bookingCars.date === payload.date &&
            carBookedEndTime >= carBookRequestStartTime) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Car is not available at this time!!");
        }
    }
    const user = yield user_modal_1.Users.findOne({ email: userEmail });
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const carStatusUpdate = yield car_modal_1.Car.findByIdAndUpdate(carId, { status: "unavailable" }, {
            new: true,
            session,
        });
        const result = yield booking_model_1.Bookings.create([
            Object.assign(Object.assign({ car: carStatusUpdate }, others), { user: user }),
        ], { session });
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const getBookingFromDb = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObj = {};
    if (req.query.carId) {
        console.log(req.query.carId);
        queryObj["car"] = new mongoose_1.Types.ObjectId(req.query.carId);
    }
    if (req.query.date) {
        queryObj.date = req.query.date;
    }
    const result = yield booking_model_1.Bookings.find(queryObj).populate("user").populate("car");
    return result;
});
const getMyBookingFromDb = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_modal_1.Users.findOne({ email });
    const result = yield booking_model_1.Bookings.find({ user: new mongoose_1.Types.ObjectId(user === null || user === void 0 ? void 0 : user._id) })
        .populate("user")
        .populate("car");
    return result;
});
exports.bookingService = {
    createBookingIntoDb,
    getBookingFromDb,
    getMyBookingFromDb,
};
