import cron from "node-cron";
import Cart from "../models/cartModel.js";
import { sendMessage } from "../utils/sendMessage.js";

const cartReminderJob = () => {
    cron.schedule("* * * * *", async () => {
        try {
            console.log("Checking abandoned carts...");

            const now = Date.now();

            const carts = await Cart.find({
                "items.0": { $exists: true }
            }).populate("user");

            for (const cart of carts) {
                const user = cart.user;

                if (!user?.phone) continue;

                // STOP AFTER 3 REMINDERS
                if (cart.reminderCount >= 3) continue;

                const last = cart.lastReminderAt
                    ? new Date(cart.lastReminderAt).getTime()
                    : 0;

                let shouldSend = false;
                let message = "";
                let type = null;

                // ---------------- 1 HOUR ----------------
                if (
                    cart.reminderCount === 0 &&
                    (!last || now - last >= 1 * 60 * 60 * 1000)
                ) {
                    shouldSend = true;
                    message =
                        "You left items in your cart 🛒 Complete your order now!";
                    type = "1h";
                }

                // ---------------- 6 HOURS ----------------
                else if (
                    cart.reminderCount === 1 &&
                    now - last >= 6 * 60 * 60 * 1000
                ) {
                    shouldSend = true;
                    message =
                        "Still thinking? Your cart is waiting 🔥";
                    type = "6h";
                }

                // ---------------- 24 HOURS ----------------
                else if (
                    cart.reminderCount === 2 &&
                    now - last >= 24 * 60 * 60 * 1000
                ) {
                    shouldSend = true;
                    message =
                        "Last chance! Your cart may expire soon ⏳";
                    type = "24h";
                }

                if (shouldSend) {
                    await sendMessage(user.phone, message);

                    console.log(
                        `📩 Sent to ${user.phone}: ${message}`
                    );

                    cart.reminderCount += 1;
                    cart.lastReminderAt = new Date();
                    cart.lastReminderType = type;

                    await cart.save();
                }
            }
        } catch (error) {
            console.error("Cart reminder error:", error);
        }
    });
};

export default cartReminderJob;