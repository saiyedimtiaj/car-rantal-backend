"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnCarValidationSchema = exports.updateCarValidationSchema = exports.createCarValidationSchema = void 0;
const zod_1 = require("zod");
exports.createCarValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        description: zod_1.z.string(),
        color: zod_1.z.string(),
        features: zod_1.z.array(zod_1.z.string()),
        pricePerHour: zod_1.z.number(),
        image: zod_1.z.string(),
        location: zod_1.z.string(),
        category: zod_1.z.string(),
        doors: zod_1.z.number(),
        passenger: zod_1.z.number(),
        luggage: zod_1.z.number(),
        status: zod_1.z.string().default("available"),
        isDeleted: zod_1.z.boolean().default(false),
    }),
});
exports.updateCarValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        color: zod_1.z.string().optional(),
        features: zod_1.z.array(zod_1.z.string()).optional(),
        pricePerHour: zod_1.z.number().optional(),
        status: zod_1.z
            .enum(["available", "unavailable"])
            .default("available")
            .optional(),
        isDeleted: zod_1.z.boolean().default(false).optional(),
        location: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
    }),
});
exports.returnCarValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.string(),
        endTime: zod_1.z
            .string()
            .refine((time) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time) || time === null, {
            message: "Invalid time format, expected HH:MM or null",
        }),
    }),
});
