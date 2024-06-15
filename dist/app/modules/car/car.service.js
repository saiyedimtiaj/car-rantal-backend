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
exports.carServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../error/AppError");
const booking_model_1 = require("../booking/booking.model");
const car_modal_1 = require("./car.modal");
const mongoose_1 = __importDefault(require("mongoose"));
const craeteCarIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_modal_1.Car.create(payload);
    return result;
});
const getCarIntoDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_modal_1.Car.find();
    return result;
});
const getSingleCarIntoDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_modal_1.Car.findById(id);
    return result;
});
const updateCarFromDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_modal_1.Car.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteCarIntodb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_modal_1.Car.findByIdAndUpdate(id, { isDeleted: true }, {
        new: true,
        runValidators: true,
    });
    return result;
});
const carReturnFromdb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookingExist = yield booking_model_1.Bookings.findById(payload.bookingId);
    if (!isBookingExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Booking not Exist!");
    }
    const bookingCar = yield car_modal_1.Car.findById(isBookingExist.car);
    if (!bookingCar) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Car not Exist!");
    }
    const startTime = new Date(`1970-01-01T${isBookingExist.startTime}:00Z`);
    const endTime = new Date(`1970-01-01T${payload.endTime}:00Z`);
    if (endTime < startTime) {
        throw new AppError_1.AppError(http_status_1.default.NOT_ACCEPTABLE, "This time is not valid!");
    }
    let diff = (endTime.getTime() - startTime.getTime()) / 1000;
    diff /= 60 * 60;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const carStatusChange = yield car_modal_1.Car.findByIdAndUpdate(bookingCar._id, { status: "available" }, {
            new: true,
            session: session,
        });
        const result = yield booking_model_1.Bookings.findByIdAndUpdate(payload.bookingId, {
            endTime: payload.endTime,
            totalCost: diff * bookingCar.pricePerHour,
        }, {
            new: true,
            runValidators: true,
            session: session,
        })
            .populate("user")
            .populate("car");
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
exports.carServices = {
    craeteCarIntoDb,
    getCarIntoDb,
    getSingleCarIntoDb,
    updateCarFromDb,
    deleteCarIntodb,
    carReturnFromdb,
};
