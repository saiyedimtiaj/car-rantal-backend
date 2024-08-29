import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import {
  createUserValidationSchem,
  loginUserValidationSchem,
} from "./user.validation";
import auth from "../../middleware/auth";
import { userRole } from "./user.constant";

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
route.post("/refresh-token", userController.refreshToken);

route.get("/", userController.getAllUsers);
route.get(
  "/current-user",
  auth(userRole.user, userRole.admin),
  userController.getCurrentUser
);

route.patch("/role/:id", auth(userRole.admin), userController.updateUserRole);

route.put(
  "/update-profile",
  auth(userRole.user, userRole.admin),
  userController.updateProfile
);

export const userRouter = route;
