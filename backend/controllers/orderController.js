import express from "express";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/Product.js";
import Address from "../models/addressModel.js";

export const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId, paymentMethod } = req.body;

        if (!["COD", "RAZORPAY"].includes(paymentMethod)) {
            return res.status(400).json({
                message: "Invalid payment method"
            });
        }

        const address = await Address.findOne({
            _id: addressId,
            user: userId
        });

        if (!address) {
            return res.status(404).json({
                message: "Address not found"
            });
        }

        const cart = await Cart.findOne({
            user: userId
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        let totalAmount = 0;

        for (const item of cart.items) {

            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    message: `${item.product.name} is out of stock`
                });
            }

            totalAmount +=
                item.product.price * item.quantity;
        }

        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));

        const order = await Order.create({
            user: userId,
            items: orderItems,
            address: addressId,
            totalAmount,
            paymentMethod,
            paymentStatus:
                paymentMethod === "COD"
                    ? "Pending"
                    : "Pending",
            orderStatus: "Pending"
        });

        for (const item of cart.items) {
            item.product.stock -= item.quantity;
            await item.product.save();
        }

        cart.items = [];
        await cart.save();

        return res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
export const getOrders=async(req,res)=>{
    try {
        const userId=req.user.id;
        const orders=await Order.find({user:userId})
        .populate("items.product").populate("address").sort({createdAt:-1});
        
        return res.status(200).json(orders);

    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const getOrderById=async(req,res)=>{
    try {
        const userId=req.user.id;
        const {id}=req.params;
        const order=await Order.findOne({
            user:userId,
            _id:id,
        }).populate("items.product").populate("address");
        if(!order){
            return res.status(404).json({message:"order not found"});
        }
        res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}