import { Router } from "express";
import { asyncHandler } from "@/shared/middleware/asyncHandler.js";
import { authenticate } from "@/shared/middleware/authenticate.js";
import { validate } from "@/shared/middleware/validate.js";
import * as leadController from "./lead.controller.js";
import {
    deleteLeadsSchema,
    leadIdSchema,
    leadListQuerySchema,
    updateLeadSchema
} from "./lead.validation.js";
import { uploadCsv } from "@/shared/middleware/multer.js";

const router = Router();

router.use(authenticate);

router.post(
    "/",
    uploadCsv,
    asyncHandler(leadController.createLeadsController)
);

router.get(
    "/",
    validate(leadListQuerySchema, "query"),
    asyncHandler(leadController.listLeadsController)
);

router.get(
    "/:id",
    validate(leadIdSchema, "params"),
    asyncHandler(leadController.getLeadController)
);

router.patch(
    "/:id",
    validate(leadIdSchema, "params"),
    validate(updateLeadSchema),
    asyncHandler(leadController.updateLeadController)
);

router.delete(
    "/",
    validate(deleteLeadsSchema),
    asyncHandler(leadController.deleteLeadsController)
);

export default router;