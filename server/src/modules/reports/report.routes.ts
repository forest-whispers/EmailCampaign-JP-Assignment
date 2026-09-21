import { Router } from "express";
import { asyncHandler } from "@/shared/middleware/asyncHandler.js";
import { authenticate } from "@/shared/middleware/authenticate.js";
import * as reportController from "./report.controller.js";

const router = Router();

router.use(authenticate);

router.get(
    "/",
    asyncHandler(reportController.getReportController)
);

export default router;