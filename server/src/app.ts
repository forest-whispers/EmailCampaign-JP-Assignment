import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { errorHandler } from "./shared/errors/errorHandler.js";
import { router } from "./routes.js";

const app = express();

const allowedOrigins = [
    "http://localhost:5173"
];

app.use(helmet());

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) =>
{
    res.status(200).json({
        message: "Server is running"
    })
});

app.use("/api", router)

app.use(errorHandler)

export default app;