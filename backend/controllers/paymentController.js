import Order from "../models/orderModel.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

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


export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                message: "Missing payment details"
            });
        }

        // Step 1: Create expected signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        // Step 2: Compare signatures
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                message: "Invalid signature. Payment verification failed."
            });
        }

        // Step 3: Find order in DB
        const order = await Order.findOne({
            razorpayOrderId: razorpay_order_id
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Step 4: Mark as paid
        order.paymentStatus = "Paid";
        await order.save();

        return res.status(200).json({
            message: "Payment verified successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};