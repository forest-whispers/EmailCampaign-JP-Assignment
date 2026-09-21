import type { NextFunction, Request, Response } from "express";
import { constants } from "../config/constants.js";
import { UnauthorizedError } from "../errors/errors.js";
import { verifyToken } from "../lib/jwt.js";

export const authenticate = async (req: Request, _res: Response, next: NextFunction) =>
{
    const token = req.cookies[constants.JWT_COOKIE_NAME]
    if(!token)
    {
        throw new UnauthorizedError("Authentication required")
    }

    try
    {
        const decodedPayload = verifyToken(token)
        req.user =
        {
            id: decodedPayload.userId
        }
        
        next()
    }
    catch(error)
    {
        next(error)
    }
}