// import nodemailer from "nodemailer";


import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
    console.log("EMAIL_USER =", process.env.EMAIL_USER);
    console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "Loaded" : "Missing");

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
};
// export const sendEmail = async (to, subject, html) => {

//     console.log("EMAIL_USER =", process.env.EMAIL_USER);
//     console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "Loaded" : "Missing");

//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//         },
//     });

//     await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to,
//         subject,
//         html,
//     });
// };