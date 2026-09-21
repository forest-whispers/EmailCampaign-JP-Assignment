import Papa from "papaparse";
import { BadRequestError } from "@/shared/errors/errors.js";
import type { LeadInput } from "./lead.types.js";

export const processCsvRows = (rows: Record<string, unknown>[]): LeadInput[] =>
{
    return rows.map((row) =>
        {
            const buyerName = String(row.name ?? row.buyerName ?? "").trim();
            const companyName = String(row.company ?? row.companyName ?? "").trim();
            const email = String(row.email ?? "").trim();
            const website = String(row.website ?? "").trim();
            const country = String(row.country ?? "").trim();
    
            return {
                ...(buyerName && { buyerName }),
                ...(companyName && { companyName }),
                email: email || null,
                ...(website && { website }),
                ...(country && { country }),
                source: "CSV"
            };
        });
}

export const parseCsv = (file: Express.Multer.File): LeadInput[] =>
{
    const csv = file.buffer.toString("utf-8")

    const result = Papa.parse<Record<string, unknown>>(csv, {
        header: true,
        skipEmptyLines: true
    })

    if(result.errors.length > 0)
    {
        throw new BadRequestError("Invalid CSV file")
    }

    return processCsvRows(result.data)
}