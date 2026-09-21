import { GoogleGenAI, Type } from "@google/genai";
import { env } from "@/shared/config/env.js";
import { BadRequestError } from "@/shared/errors/errors.js";
import { constants } from "./classification.constants.js";

const ai = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY
})

type ClassificationInput =
{
    id: string
    buyerName?: string | null
    companyName?: string | null
    email?: string | null
    website?: string | null
    country?: string | null
}

type ClassificationResult =
{
    id: string
    classification: "BUSINESS" | "INDIVIDUAL"
}

export const classifyLeadsWithAi = async (leads: ClassificationInput[]): Promise<ClassificationResult[]> =>
{
    const prompt = `
Classify each lead as either BUSINESS or INDIVIDUAL.

A BUSINESS lead represents a company, importer, distributor, retailer,
wholesaler, business buyer, organization, or commercial entity.

An INDIVIDUAL lead represents a private person who is not clearly acting
on behalf of a business.

Use the available information together. Do not invent information.

Return one classification for every lead.

Leads:
${JSON.stringify(leads)}
`
    const response = await ai.models.generateContent({
        model: constants.AI_MODEL_NAME,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: {
                            type: Type.STRING
                        },
                        classification: {
                            type: Type.STRING,
                            enum: [
                                "BUSINESS",
                                "INDIVIDUAL"
                            ]
                        }
                    },
                    required: [
                        "id",
                        "classification"
                    ]
                }
            }
        }
    })

    if(!response.text)
    {
        throw new BadRequestError("AI classification failed")
    }

    try
    {
        return JSON.parse(response.text) as ClassificationResult[]
    }
    catch
    {
        throw new BadRequestError("Invalid AI classification response")
    }
}