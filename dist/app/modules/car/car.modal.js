"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = void 0;
const mongoose_1 = require("mongoose");
const carSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    color: { type: String, required: true },
    features: { type: [String], required: true },
    pricePerHour: { type: Number, required: true },
    image: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    doors: { type: Number, required: true },
    passenger: { type: Number, required: true },
    luggage: { type: Number, required: true },
    status: {
        type: String,
        default: "available",
        enum: ["available", "unavailable"],
    },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
exports.Car = (0, mongoose_1.model)("Car", carSchema);
