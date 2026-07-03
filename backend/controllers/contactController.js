// import { sendEmail } from "../utils/sendEmail.js";

// export const contactUs = async (req, res) => {
//     try {
//         const { name, email, message } = req.body;

//         if (!name || !email || !message) {
//             return res.status(400).json({
//                 message: "All fields are required",
//             });
//         }

//         const html = `
//             <h2>New Contact Form Submission</h2>

//             <p><strong>Name:</strong> ${name}</p>

//             <p><strong>Email:</strong> ${email}</p>

//             <p><strong>Message:</strong></p>

//             <p>${message.replace(/\n/g, "<br/>")}</p>
//         `;

//         await sendEmail(
//             "dm@oatscrush.co.in",
//             "New Contact Form Submission",
//             html
//         );

//         res.json({
//             success: true,
//             message: "Message sent successfully",
//         });
//     } catch (err) {
//         console.error(err);

//         res.status(500).json({
//             message: "Unable to send message",
//         });
//     }
// };

import { sendEmail } from "../utils/sendEmail.js";

export const contactUs = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Email sent to your team
        const html = `
            <h2>New Contact Form Submission</h2>

            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>

            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br/>")}</p>
        `;

        await sendEmail(
            "dm@oatscrush.co.in",
            "New Contact Form Submission",
            html,
            email // Reply-To so your team can reply directly
        );

        // Acknowledgement email sent to the customer
        const acknowledgementHtml = `
            <h2>Thank you for contacting Oats Crush!</h2>

            <p>Hi ${name},</p>

            <p>We've received your message and our team will get back to you within 24 hours.</p>

            <p>Here's a copy of your message:</p>

            <blockquote style="border-left:4px solid #f97316;padding-left:12px;">
                ${message.replace(/\n/g, "<br/>")}
            </blockquote>

            <p>Thank you for choosing Oats Crush.</p>

            <p>Regards,<br/>Oats Crush Team</p>
        `;

        await sendEmail(
            email,
            "We've received your message",
            acknowledgementHtml
        );

        res.status(200).json({
            success: true,
            message: "Message sent successfully",
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to send message",
        });
    }
};