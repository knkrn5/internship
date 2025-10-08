import nodemailer from 'nodemailer';

type EmailPropsTypes = {
    toEmail: string | string[];
    subject: string;
    content: string;

};

export const emailTransporter = async ({
    toEmail,
    subject,
    content,
}: EmailPropsTypes): Promise<void> => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true, // true for port 465 (SSL), false for port 587 (STARTTLS)
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASS,
        },
    } as nodemailer.TransportOptions);

    const mailOptions = {
        from: `"Atomworld" <${process.env.EMAIL_FROM}>`,
        to: toEmail,
        subject: `${subject} `,
        text: `${content}`,
        html: content,
    };

    await transporter.sendMail(mailOptions);
};