import { Router } from "express";
import {
  dashbaordAnalysis,
  dashbaordAnalysisForChart,
  recentBooking,
  weeklyAnalysis,
} from "./analysis.controller";

const route = Router();

route.get("/", weeklyAnalysis);
route.get("/dashboard", dashbaordAnalysis);
route.get("/analysis", dashbaordAnalysisForChart);
route.get("/recent-book", recentBooking);

export const analysisRoute = route;
