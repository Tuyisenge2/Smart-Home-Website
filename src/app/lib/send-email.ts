/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;
import nodemailer from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";

export interface MailOptions {
  to: string;
  subject: string;
  html: any;
  attachments?: Attachment[];
}

const sender = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SITE_MAIL_RECIEVER,
    pass: SMTP_SERVER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: MailOptions) {

 
  const mailOptions: nodemailer.SendMailOptions = {
    from: `"${SMTP_SERVER_USERNAME}" <${SITE_MAIL_RECIEVER}>`,
    to,
    subject,
    html,
    attachments,
  };

  return new Promise((resolve, reject) => {
    sender.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("EMAILING USER FAILED:", error);
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}
