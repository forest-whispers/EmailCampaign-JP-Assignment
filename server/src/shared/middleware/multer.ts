import multer from "multer";
import { BadRequestError } from "../errors/errors.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (_req, file, callback) =>
    {
        if(file.mimetype === "text/csv" || file.originalname.toLowerCase().endsWith(".csv"))
        {
            callback(null, true)
            return
        }

        callback(new BadRequestError("Only CSV files are allowed"))
    }
})

export const uploadCsv = upload.single("file")