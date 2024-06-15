"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const route = (0, express_1.Router)();
route.post("/signup", user_controller_1.userController.createUser);
exports.userRouter = route;
