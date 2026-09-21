import type { Request, Response } from "express";
import { env } from "../config/env.js";
import { constants } from "../config/constants.js";

export const getCookieOptions = (req?: Request) => {
    // Use the request protocol as the primary signal and production as the deployment fallback
    const isHttps = req ? Boolean(req.secure || req.headers["x-forwarded-proto"] === "https") : false;
    const isProduction = env.NODE_ENV === "production";
    const isSecure = isHttps || isProduction;

    return {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? ("none" as const) : ("lax" as const),
        path: "/",
    };
};

export const setAuthCookies = (res: Response, token: string) => {
    const options = getCookieOptions(res.req);
    res.cookie(
        constants.JWT_COOKIE_NAME,
        token,
        {
            ...options,
            maxAge: constants.JWT_COOKIE_MAX_AGE,
        }
    );
};

export const clearAuthCookies = (res: Response) => {
    const options = getCookieOptions(res.req);
    res.clearCookie(constants.JWT_COOKIE_NAME, options);
};