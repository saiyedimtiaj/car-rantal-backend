import { z } from "zod";

export const createUserValidationSchem = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6, "Password must be 6 cherecture or longer"),
    address: z.string(),
    phone: z.string(),
    role: z.enum(["user", "admin"]),
  }),
});

export const loginUserValidationSchem = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be 6 cherecture or longer"),
  }),
});
