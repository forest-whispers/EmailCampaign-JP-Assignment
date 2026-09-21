import type { Request, Response } from "express";
import type { LoginInput, RegisterInput } from "./auth.types.js";
import * as authService from "./auth.service.js";
import { setAuthCookies, clearAuthCookies } from "@/shared/utils/cookies.js";

export const registerController = async (
    req: Request<{}, {}, RegisterInput>,
    res: Response
) =>
{
    const result = await authService.registerService(req.body);

    setAuthCookies(res, result.token);

    res.status(201).json({
        user: result.user
    })
}

export const loginController = async (
    req: Request<{}, {}, LoginInput>,
    res: Response
) =>
{
    const result = await authService.loginService(req.body);

    setAuthCookies(res, result.token);

    res.status(200).json({
        user: result.user
    })
}

export const getMeController = async (
    req: Request,
    res: Response
) =>
{
    const user = await authService.getMeService(req.user.id);

    res.status(200).json({
        user
    })
}

export const logoutController = async (
    req: Request,
    res: Response
) =>
{
    clearAuthCookies(res);

    res.status(200).json({
        message: "Logged out successfully."
    })
}