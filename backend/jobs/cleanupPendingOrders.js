// import cron from "node-cron";
// import Order from "../models/orderModel.js";
// import Product from "../models/Product.js";

// const cleanupPendingOrders = () => {
//     cron.schedule("*/15 * * * *", async () => {
//         try {
//             console.log(
//                 "Checking expired Razorpay orders..."
//             );

//             const thirtyMinutesAgo = new Date(
//                 Date.now() - 1 * 60 * 1000
//             );

//             const expiredOrders = await Order.find({
//                 paymentMethod: "RAZORPAY",
//                 paymentStatus: "Pending",
//                 orderStatus: "Pending",
//                 createdAt: {
//                     $lt: thirtyMinutesAgo,
//                 },
//             });

//             for (const order of expiredOrders) {
//                 for (const item of order.items) {
//                     await Product.findByIdAndUpdate(
//                         item.product,
//                         {
//                             $inc: {
//                                 stock: item.quantity,
//                             },
//                         }
//                     );
//                 }

//                 order.paymentStatus = "Failed";
//                 order.orderStatus = "Cancelled";
//                 order.cancelledAt = new Date();
//                 await order.save();

//                 console.log(
//                     `Cancelled order ${order._id}`
//                 );
//             }
//         } catch (error) {
//             console.error(
//                 "Cleanup job failed:",
//                 error
//             );
//         }
//     });
// };

// export default cleanupPendingOrders;

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
                Date.now() - 30 * 60 * 1000
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
                    // ---- CUSTOM BOX ITEMS ----
                    if (item.isCustomBox) {
                        const productCounts = {};
                        for (const pid of item.customProducts) {
                            const key = pid.toString();
                            productCounts[key] = (productCounts[key] || 0) + 1;
                        }
                        for (const pid of Object.keys(productCounts)) {
                            await Product.findByIdAndUpdate(pid, {
                                $inc: { stock: productCounts[pid] },
                            });
                        }
                        continue;
                    }

                    // ---- NORMAL / PACK ITEMS ----
                    const packUnits = item.pack?.units || 1;
                    await Product.findByIdAndUpdate(
                        item.product,
                        {
                            $inc: {
                                stock: item.quantity * packUnits,
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