import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
    console.log("EMAIL_USER =", process.env.EMAIL_USER);
    console.log("EMAIL_PASS =", process.env.RESEND_API_KEY ? "Loaded" : "Missing");

    const transporter = nodemailer.createTransport({
        host: "smtp.resend.com",
        port: 465,
        secure: true,                  // true for port 465
        auth: {
            user: "resend",            // must be literally "resend"
            pass: process.env.RESEND_API_KEY,
        },
    });

    await transporter.verify();
    console.log("SMTP connection successful");

    await transporter.sendMail({
        from: "onboarding@resend.dev", // use this until you verify your domain
        to,
        subject,
        html,
    });
};