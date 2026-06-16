import cron from "node-cron";
import Order from "../models/orderModel.js";
import Product from "../models/Product.js";

const cleanupPendingOrders = () => {
    cron.schedule("*/15 * * * *", async () => {
        try {
            console.log(
                "Checking expired Razorpay orders..."
            );

            const thirtyMinutesAgo = new Date(
                Date.now() - 1 * 60 * 1000
            );

            const expiredOrders = await Order.find({
                paymentMethod: "RAZORPAY",
                paymentStatus: "Pending",
                orderStatus: "Pending",
                createdAt: {
                    $lt: thirtyMinutesAgo,
                },
            });

            for (const order of expiredOrders) {
                for (const item of order.items) {
                    await Product.findByIdAndUpdate(
                        item.product,
                        {
                            $inc: {
                                stock: item.quantity,
                            },
                        }
                    );
                }

                order.paymentStatus = "Failed";
                order.orderStatus = "Cancelled";
                order.cancelledAt = new Date();
                await order.save();

                console.log(
                    `Cancelled order ${order._id}`
                );
            }
        } catch (error) {
            console.error(
                "Cleanup job failed:",
                error
            );
        }
    });
};

export default cleanupPendingOrders;