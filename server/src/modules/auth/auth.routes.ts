import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/asyncHandler.js";
import { validate } from "@/shared/middleware/validate.js";
import * as authController from "./auth.controller.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { authenticate } from "@/shared/middleware/authenticate.js";

const router = Router();

router.post(
    "/register",
    validate(registerSchema),
    asyncHandler(authController.registerController)
);

router.post(
    "/login",
    validate(loginSchema),
    asyncHandler(authController.loginController)
);

router.get(
    "/me",
    authenticate,
    asyncHandler(authController.getMeController)
);

router.post(
    "/logout",
    authenticate,
    asyncHandler(authController.logoutController)
);

export default router;