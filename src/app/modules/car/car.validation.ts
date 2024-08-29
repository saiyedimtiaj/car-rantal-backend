import { z } from "zod";

export const createCarValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string(),
    color: z.string(),
    features: z.array(z.string()),
    pricePerHour: z.number(),
    image: z.string(),
    location: z.string(),
    category: z.string(),
    doors: z.number(),
    passenger: z.number(),
    luggage: z.number(),
    status: z.string().default("available"),
    isDeleted: z.boolean().default(false),
  }),
});

export const updateCarValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    color: z.string().optional(),
    features: z.array(z.string()).optional(),
    pricePerHour: z.number().optional(),
    status: z
      .enum(["available", "unavailable"])
      .default("available")
      .optional(),
    isDeleted: z.boolean().default(false).optional(),
    location: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const returnCarValidationSchema = z.object({
  body: z.object({
    bookingId: z.string(),
    endTime: z
      .string()
      .refine(
        (time) =>
          /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time) || time === null,
        {
          message: "Invalid time format, expected HH:MM or null",
        }
      ),
  }),
});
