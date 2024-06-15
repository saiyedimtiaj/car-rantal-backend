import { z } from "zod";

const timeRegEx = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
const dateRegEx = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

export const createBookingValidationSchema = z.object({
  body: z.object({
    date: z.string().refine((time) => dateRegEx.test(time), {
      message: "Invalid Date format, expected YYYY-MM-DD",
    }),
    startTime: z.string().refine((time) => timeRegEx.test(time), {
      message: "Invalid time format, expected HH:MM",
    }),
    endTime: z
      .string()
      .refine((time) => timeRegEx.test(time) || time === null, {
        message: "Invalid time format, expected HH:MM or null",
      })
      .optional()
      .nullable()
      .default(null),
    user: z.string().optional(),
    carId: z.string(),
    totalCost: z.number().default(0).optional(),
  }),
});
