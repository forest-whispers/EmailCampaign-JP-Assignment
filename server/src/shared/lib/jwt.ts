import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { constants } from "../config/constants.js";
import { UnauthorizedError } from "../errors/errors.js";

export type JwtPayload =
{
    userId: string
}

export const generateToken = (userId: string) =>
{
    return jwt.sign(
        { userId },
        env.JWT_SECRET,
        {
            expiresIn: constants.JWT_TOKEN_EXPIRY
        }
    )
}

export const verifyToken = (token: string): JwtPayload =>
{
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (typeof decoded === "string" || typeof decoded.userId !== "string")
    {
        throw new UnauthorizedError("Token payload is invalid")
    }

    return {
        userId: decoded.userId
    }
}