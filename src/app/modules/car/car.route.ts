import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import {
  createCarValidationSchema,
  updateCarValidationSchema,
} from "./car.validation";
import { carController } from "./car.controller";
import auth from "../../middleware/auth";
import { userRole } from "../user/user.constant";

const route = Router();

route.post(
  "/",
  validateRequest(createCarValidationSchema),
  auth(userRole.admin),
  carController.createCar
);
route.patch(
  "/:id",
  validateRequest(updateCarValidationSchema),
  auth(userRole.admin),
  carController.updateCar
);
route.put("/return", auth(userRole.admin), carController.returnCar);
route.delete("/:id", auth(userRole.admin), carController.deleteCar);

route.get("/", carController.getCar);
route.get("/:id", carController.getSingleCar);

export const carRoute = route;
