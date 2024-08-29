"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bookings = void 0;
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String || null, default: null },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", required: true },
    car: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Car" },
    totalCost: { type: Number, default: 0 },
    passport: { type: String, required: true },
    license: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, required: true, default: "panding" },
}, {
    timestamps: true,
});
exports.Bookings = (0, mongoose_1.model)("Bookings", bookingSchema);
