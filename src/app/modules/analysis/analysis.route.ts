import { Router } from "express";
import { dashbaordAnalysis, weeklyAnalysis } from "./analysis.controller";

const route = Router();

route.get("/", weeklyAnalysis);
route.get("/dashboard", dashbaordAnalysis);

export const analysisRoute = route;
