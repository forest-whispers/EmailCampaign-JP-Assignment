import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { errorHandler } from "./shared/errors/errorHandler.js";
import router from "./routes.js";

const app = express();
app.set("trust proxy", 1);

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://email-campaign-jp-assignment.vercel.app",
    "https://vercel.com/forest-whispers-projects/email-campaign-jp-assignment/9DQTj8u8fcXTjKLz1xPR3XhJb78s"
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