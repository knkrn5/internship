import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    try {
        const { data, error } = await resend.emails.send({
            from: 'Atomworld <noreply@karan.email>',
            to: toEmail,
            subject: subject,
            html: content,
        });

        if (error) {
            console.error('❌ Resend error:', error);
            throw new Error(error.message);
        }

        console.log('✅ Email sent successfully:', data?.id);
    } catch (error: any) {
        console.error('❌ Failed to send email:', error);
        throw error;
    }
};