import type { Request, Response } from "express";
import * as campaignService from "./campaign.service.js";

export const createCampaignController = async (
    req: Request,
    res: Response
) =>
{
    const campaign = await campaignService.createCampaignService(
        req.body
    )

    return res.status(201).json({
        campaign
    })
}

export const listCampaignsController = async (
    _req: Request,
    res: Response
) =>
{
    const campaigns = await campaignService.listCampaignsService()

    return res.status(200).json({
        campaigns
    })
}

export const getCampaignController = async (
    req: Request,
    res: Response
) =>
{
    const campaign = await campaignService.getCampaignService(
        req.params.id as string
    )

    return res.status(200).json({
        campaign
    })
}

export const updateCampaignController = async (
    req: Request,
    res: Response
) =>
{
    const campaign = await campaignService.updateCampaignService(
        req.params.id as string,
        req.body
    )

    return res.status(200).json({
        campaign
    })
}

export const deleteCampaignController = async (
    req: Request,
    res: Response
) =>
{
    const result = await campaignService.deleteCampaignService(
        req.params.id as string
    )

    return res.status(200).json(result)
}

export const sendCampaignController = async (
    req: Request,
    res: Response
) =>
{
    const result = await campaignService.sendCampaignService(
        req.params.id as string,
        req.body
    )

    return res.status(200).json(result)
}