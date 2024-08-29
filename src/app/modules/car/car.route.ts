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
route.put(
  "/return",
  auth(userRole.admin, userRole.user),
  carController.returnCar
);
route.delete("/:id", auth(userRole.admin), carController.deleteCar);

route.put(
  "/car-back/:id",
  auth(userRole.admin),
  carController.manageCarsStatusAbailable
);

route.get("/", carController.getCar);
route.get("/cars/:id", carController.getSingleCar);

route.get("/manage-cars", carController.manageCars);

export const carRoute = route;
