import Order from "../models/orderModel.js";
import razorpay from "../config/razorpay.js";

export const createRazorpayOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required"
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const options = {
            amount: order.totalAmount * 100,
            currency: "INR",
            receipt: order._id.toString()
        };

        const razorpayOrder =
            await razorpay.orders.create(options);

        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return res.status(200).json({
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};