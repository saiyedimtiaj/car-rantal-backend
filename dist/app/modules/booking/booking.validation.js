"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingValidationSchema = void 0;
const zod_1 = require("zod");
const timeRegEx = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
const dateRegEx = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
exports.createBookingValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z.string().refine((time) => dateRegEx.test(time), {
            message: "Invalid Date format, expected YYYY-MM-DD",
        }),
        startTime: zod_1.z.string().refine((time) => timeRegEx.test(time), {
            message: "Invalid time format, expected HH:MM",
        }),
        endTime: zod_1.z
            .string()
            .refine((time) => timeRegEx.test(time) || time === null, {
            message: "Invalid time format, expected HH:MM or null",
        })
            .optional()
            .nullable()
            .default(null),
        user: zod_1.z.string().optional(),
        carId: zod_1.z.string(),
        totalCost: zod_1.z.number().default(0).optional(),
        passport: zod_1.z.string().optional(),
        license: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        status: zod_1.z.string().default("panding"),
    }),
});
