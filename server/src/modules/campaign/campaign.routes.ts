import { Router } from "express";
import { asyncHandler } from "@/shared/middleware/asyncHandler.js";
import { authenticate } from "@/shared/middleware/authenticate.js";
import { validate } from "@/shared/middleware/validate.js";
import * as campaignController from "./campaign.controller.js";
import {
    campaignIdSchema,
    createCampaignSchema,
    sendCampaignSchema,
    updateCampaignSchema
} from "./campaign.validation.js";

const router = Router();

router.use(authenticate);

router.post(
    "/",
    validate(createCampaignSchema),
    asyncHandler(campaignController.createCampaignController)
);

router.get(
    "/",
    asyncHandler(campaignController.listCampaignsController)
);

router.get(
    "/:id",
    validate(campaignIdSchema, "params"),
    asyncHandler(campaignController.getCampaignController)
);

router.patch(
    "/:id",
    validate(campaignIdSchema, "params"),
    validate(updateCampaignSchema),
    asyncHandler(campaignController.updateCampaignController)
);

router.delete(
    "/:id",
    validate(campaignIdSchema, "params"),
    asyncHandler(campaignController.deleteCampaignController)
);

router.post(
    "/:id/send",
    validate(campaignIdSchema, "params"),
    validate(sendCampaignSchema),
    asyncHandler(campaignController.sendCampaignController)
);

export default router;