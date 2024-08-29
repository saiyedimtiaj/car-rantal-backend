"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoute = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const route = (0, express_1.Router)();
route.post("/confirmation", payment_controller_1.confirmationController);
exports.paymentRoute = route;
