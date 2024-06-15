"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const router = (0, express_1.Router)();
// const moduleRoutes = [
//   {
//     path: "/auth",
//     route: userRouter,
//   },
// ];
// moduleRoutes.forEach((route) => router.use(route.path, route.route));
router.use("/auth", user_route_1.userRouter);
exports.default = router;
