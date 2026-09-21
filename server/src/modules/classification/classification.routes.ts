import { Router } from "express";
import { asyncHandler } from "@/shared/middleware/asyncHandler.js";
import { authenticate } from "@/shared/middleware/authenticate.js";
import * as classificationController from "./classification.controller.js";

const router = Router();

router.use(authenticate);

router.post(
    "/",
    asyncHandler(classificationController.classifyLeadsController)
);

export default router;