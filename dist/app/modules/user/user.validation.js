"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserValidationSchem = exports.createUserValidationSchem = void 0;
const zod_1 = require("zod");
exports.createUserValidationSchem = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6, "Password must be 6 cherecture or longer"),
        address: zod_1.z.string(),
        phone: zod_1.z.string(),
        role: zod_1.z.enum(["user", "admin"]),
    }),
});
exports.loginUserValidationSchem = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6, "Password must be 6 cherecture or longer"),
    }),
});
