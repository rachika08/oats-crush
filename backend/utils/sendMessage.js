export const sendMessage = async (phone, message) => {
    try {
        // TEMP (for now)
        console.log("📩 Sending to:", phone);
        console.log("Message:", message);

        // Later replace with:
        // Twilio / WhatsApp API / MSG91

    } catch (err) {
        console.error("Message send failed:", err);
    }
};