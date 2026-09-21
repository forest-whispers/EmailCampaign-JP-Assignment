import { Router } from "express";
import authRouter from "@/modules/auth/auth.routes.js";
import leadRouter from "@/modules/leads/lead.routes.js";
import classificationRouter from "@/modules/classification/classification.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/leads", leadRouter);
router.use("/leads/classify", classificationRouter);

export default router;