import { Router } from "express";
import { confirmationController } from "./payment.controller";

const route = Router();

route.post("/confirmation", confirmationController);

export const paymentRoute = route;
