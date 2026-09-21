import type { Response } from "express";
import { env } from "../config/env.js";
import { constants } from "../config/constants.js";

const cookieOptions =
{
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: (env.NODE_ENV === "production") ? "none" : "lax"
} as const;

export const setAuthCookies = (res: Response, token: string) =>
{
    res.cookie(
        constants.JWT_COOKIE_NAME,
        token,
        {
            ...cookieOptions,
            maxAge: constants.JWT_COOKIE_MAX_AGE
        }
    )
}

export const clearAuthCookies = (res: Response) =>
{
    res.clearCookie(constants.JWT_COOKIE_NAME, cookieOptions);
}