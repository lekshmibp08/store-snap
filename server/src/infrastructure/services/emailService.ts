import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { config } from "../../config/config";

dotenv.config();

export const sendEmail = async (
    to: string, 
    subject: string, 
    text: string
): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.mailer.EMAIL_USER, 
        pass: config.mailer.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};
