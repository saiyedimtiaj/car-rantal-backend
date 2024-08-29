"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analysisRoute = void 0;
const express_1 = require("express");
const analysis_controller_1 = require("./analysis.controller");
const route = (0, express_1.Router)();
route.get("/", analysis_controller_1.weeklyAnalysis);
route.get("/dashboard", analysis_controller_1.dashbaordAnalysis);
exports.analysisRoute = route;
