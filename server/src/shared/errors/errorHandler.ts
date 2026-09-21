import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "./AppError.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) =>
{
    if (err instanceof ZodError)
    {
        const message = err.issues[0]?.message || "Validation failed";
        return res.status(422).json({ message });
    }
    else if(err instanceof AppError)
    {
        return res.status(err.statusCode).json({
            message: err.message
        })
    }
    console.log("ExceptionalError: ", err)
    res.status(500).json({
        message: "Internal Server Error"
    })
}