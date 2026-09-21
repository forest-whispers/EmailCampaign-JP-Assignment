import type { Request, Response } from "express";
import * as classificationService from "./classification.service.js";

export const classifyLeadsController = async (_req: Request, res: Response) =>
{
    const result = await classificationService.classifyLeadsService()

    return res.status(200).json(result)
}