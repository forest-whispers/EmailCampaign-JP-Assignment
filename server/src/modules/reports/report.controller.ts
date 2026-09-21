import type { Request, Response } from "express";
import * as reportService from "./report.service.js";

export const getReportController = async (
    _req: Request,
    res: Response
) =>
{
    const report = await reportService.getReportService()

    return res.status(200).json({
        report
    })
}