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
Object.defineProperty(exports, "__esModule", { value: true });
exports.carServices = void 0;
const booking_model_1 = require("../booking/booking.model");
const car_modal_1 = require("./car.modal");
const payment_1 = require("../../utils/payment");
const craeteCarIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_modal_1.Car.create(payload);
    return result;
});
const getCarIntoDb = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, color, searchTrams, location, date } = queryParams;
    const query = {};
    if (category) {
        query.category = category;
    }
    if (color) {
        query.color = color;
    }
    if (searchTrams) {
        query.$or = [
            { name: { $regex: searchTrams, $options: "i" } },
            { description: { $regex: searchTrams, $options: "i" } },
        ];
    }
    if (location) {
        query.location = location;
    }
    if (date) {
        const notAvailableCars = yield booking_model_1.Bookings.find({ date: date });
        const bookedCarIds = notAvailableCars.map((car) => car.car);
        query._id = { $nin: bookedCarIds };
    }
    const result = yield car_modal_1.Car.find(query);
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
    const result = yield car_modal_1.Car.findByIdAndDelete(id);
    return result;
});
const carReturnFromdb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentData = {
        id: `TXN-${Date.now()}`,
        amount: 500,
        name: "Saiyed",
        email: "saiyed@gmail.com",
        bookingId: payload.bookingId,
        endTime: payload.endTime,
    };
    const paymentSession = yield (0, payment_1.initiatePayment)(paymentData);
    return paymentSession;
});
const manageCar = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_modal_1.Car.find({ status: { $ne: "available" } });
    return result;
});
const carBack = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_modal_1.Car.findByIdAndUpdate(id, { status: "available" }, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.carServices = {
    craeteCarIntoDb,
    getCarIntoDb,
    getSingleCarIntoDb,
    updateCarFromDb,
    deleteCarIntodb,
    carReturnFromdb,
    manageCar,
    carBack,
};
