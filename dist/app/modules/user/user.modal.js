"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true, enum: ["user", "admin"] },
}, {
    timestamps: true,
});
userSchema.set("toJSON", {
    transform: (doc, ret, options) => {
        delete ret.password;
        return ret;
    },
});
exports.Users = (0, mongoose_1.model)("Users", userSchema);
