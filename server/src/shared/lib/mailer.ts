import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.GMAIL_USER,
        pass: env.GMAIL_APP_PASSWORD
    }
})

type SendEmailInput =
{
    to: string
    subject: string
    text: string
    attachmentPath: string
}

export const sendEmail = async ({
    to,
    subject,
    text,
    attachmentPath
}: SendEmailInput) =>
{
    await transporter.sendMail({
        from: env.GMAIL_USER,
        to,
        subject,
        text,
        attachments: [
            {
                path: attachmentPath
            }
        ]
    })
}