import type { Request, Response } from "express";
import type { LeadListQuery } from "./lead.types.js";
import * as leadService from "./lead.service.js";
import { parseCsv } from "./lead.ingestion.helper.js";

export const createLeadsController = async (req: Request, res: Response) =>
{
    let leads = req.body.leads

    if(req.file)
    {
        leads = parseCsv(req.file)
    }

    const result = await leadService.createLeadsService(req.body)

    return res.status(201).json(result)
}

export const listLeadsController = async (req: Request, res: Response) =>
{
    const result = await leadService.listLeadsService({
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        ...(req.query.search && { search: req.query.search as string }),
        ...(req.query.source && { source: req.query.source as LeadListQuery["source"] }),
        ...(req.query.emailStatus && { emailStatus: req.query.emailStatus as LeadListQuery["emailStatus"] }),
        ...(req.query.classification && { classification: req.query.classification as LeadListQuery["classification"] })
    } as LeadListQuery);

    return res.status(200).json(result)
}

export const getLeadController = async (req: Request, res: Response) =>
{
    const lead = await leadService.getLeadService(req.params.id as string)

    return res.status(200).json({
        lead
    })
}

export const updateLeadController = async (req: Request, res: Response) =>
{
    const lead = await leadService.updateLeadService(
        req.params.id as string,
        req.body
    )

    return res.status(200).json({
        lead
    })
}

export const deleteLeadsController = async (req: Request, res: Response) =>
{
    const result = await leadService.deleteLeadsService(
        req.body.leadIds
    )

    return res.status(200).json(result)
}