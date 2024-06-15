"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const route = (0, express_1.Router)();
route.post("/signup", (0, validateRequest_1.default)(user_validation_1.createUserValidationSchem), user_controller_1.userController.createUser);
route.post("/signin", (0, validateRequest_1.default)(user_validation_1.loginUserValidationSchem), user_controller_1.userController.loginUser);
exports.userRouter = route;
