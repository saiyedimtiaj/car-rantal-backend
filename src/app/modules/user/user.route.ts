import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import {
  createUserValidationSchem,
  loginUserValidationSchem,
} from "./user.validation";

const route = Router();

route.post(
  "/signup",
  validateRequest(createUserValidationSchem),
  userController.createUser
);

route.post(
  "/signin",
  validateRequest(loginUserValidationSchem),
  userController.loginUser
);

export const userRouter = route;
