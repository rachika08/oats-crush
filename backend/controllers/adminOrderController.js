import express from 'express';
import Order from "../models/orderModel.js";

export const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate("user", "name email")
            .populate("address")
            .populate("items.product")
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

export const getOrderByIdAdmin = async (req, res) => {
    try {

        const { id } = req.params;

        const order = await Order.findById(id)
            .populate("user", "name email")
            .populate("address")
            .populate("items.product");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json(order);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

export const updateOrderStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { orderStatus } = req.body;

        const allowedStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(orderStatus)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.orderStatus = orderStatus;

        await order.save();

        return res.status(200).json({
            message: "Order status updated",
            order
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};