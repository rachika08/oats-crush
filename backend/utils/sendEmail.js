import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
    console.log("Sending email via Resend HTTP API...");
    
    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to,
        subject,
        html,
    });

    if (error) {
        console.error("Resend error:", error);
        throw new Error(error.message);
    }

    console.log("Email sent successfully:", data.id);
};