import nodemailer from "nodemailer"

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.zoho.in',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
    },
});

// Wrap in an async IIFE so we can use await.
export const sendMailOtp = async (receiverEmail: string, subject: string, content: string) => {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: receiverEmail,
        subject: subject,
        text: content,
        html: `<b>${content}</b>`,
    });

    console.log("Message sent:", info);
    return info

};