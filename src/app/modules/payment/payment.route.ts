import { Router } from "express";
import {
  confirmationController,
  paymentFailedConfirmationController,
} from "./payment.controller";

const route = Router();

route.post("/confirmation", confirmationController);
route.post("/failed", paymentFailedConfirmationController);

export const paymentRoute = route;
