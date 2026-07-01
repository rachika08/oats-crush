import express from "express";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/Product.js";
import Address from "../models/addressModel.js";

export const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId, paymentMethod } = req.body;

        // ---------------- VALIDATION ----------------
        if (!["COD", "RAZORPAY"].includes(paymentMethod)) {
            return res.status(400).json({ message: "Invalid payment method" });
        }

        const address = await Address.findOne({
            _id: addressId,
            user: userId
        });

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        // ---------------- GET CART ----------------
        const cart = await Cart.findOne({ user: userId })
            .populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        let totalAmount = 0;
        const orderItems = [];

        // ---------------- PROCESS ITEMS ----------------
        for (const item of cart.items) {

            // ================= CUSTOM BOX =================
            // if (item.isCustomBox) {
            //     totalAmount += item.customPrice;

            //     orderItems.push({
            //         isCustomBox: true,
            //         packSize: item.packSize,
            //         customProducts: item.customProducts,
            //         quantity: 1,
            //         price: item.customPrice
            //     });

            //     continue;
            // }
            if (item.isCustomBox) {
                const productCounts = {};
                for (const pid of item.customProducts) {
                    const key = pid.toString();
                    productCounts[key] = (productCounts[key] || 0) + 1;
                }

                for (const pid of Object.keys(productCounts)) {
                    const freshProduct = await Product.findById(pid);
                    if (!freshProduct || freshProduct.stock < productCounts[pid]) {
                        return res.status(400).json({
                            message: `${freshProduct?.name || "A product"} in your custom box is out of stock`
                        });
                    }
                }

                totalAmount += item.customPrice;
                orderItems.push({
                    isCustomBox: true,
                    packSize: item.packSize,
                    customProducts: item.customProducts,
                    quantity: 1,
                    price: item.customPrice
                });

                for (const pid of Object.keys(productCounts)) {
                    await Product.findByIdAndUpdate(pid, { $inc: { stock: -productCounts[pid] } });
                }

                continue;
            }

            // ================= NORMAL PRODUCT =================
            const product = item.product;
            const packUnits = item.pack?.units || 1;
            const quantityNeeded = item.quantity * packUnits;

            if (!product) {
                return res.status(400).json({ message: "Product missing in cart" });
            }

            // 🔥 STOCK CHECK (REAL DB VALUE SAFE)
            const freshProduct = await Product.findById(product._id);

            if (!freshProduct || freshProduct.stock < quantityNeeded) {
                return res.status(400).json({
                    message: `${product.name} is out of stock`
                });
            }

            // 💰 PRICE CALCULATION
            const itemTotal = item.quantity * item.pack.price;
            totalAmount += itemTotal;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                pack: item.pack,
                price: item.pack.price,
                isCustomBox: false
            });

            // 🔥 STOCK UPDATE (FIXED - NO SAVE BUG)
            await Product.findByIdAndUpdate(
                product._id,
                {
                    $inc: {
                        stock: -quantityNeeded
                    }
                }
            );
        }

        // ---------------- CREATE ORDER ----------------
        const order = await Order.create({
            user: userId,
            items: orderItems,
            address: addressId,
            totalAmount,
            paymentMethod,
            paymentStatus: "Pending",
            orderStatus: "Pending"
        });

        // ---------------- CLEAR CART ----------------
        cart.items = [];
        cart.reminderCount = 0;
        cart.lastReminderAt = null;
        cart.lastReminderType = null;

        await cart.save();

        return res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
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

export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({
            _id: id,
            user: req.user.id,
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        // ❌ Block if already progressed
        if (order.orderStatus !== "Pending") {
            return res.status(400).json({
                message:
                    "Only pending orders can be cancelled",
            });
        }

        // 🔁 Restore stock
        // for (const item of order.items) {
        //     await Product.findByIdAndUpdate(
        //         item.product,
        //         {
        //             $inc: {
        //                 stock: item.quantity,
        //             },
        //         }
        //     );
        // }
        for (const item of order.items) {
            if (item.isCustomBox) {
                const productCounts = {};
                for (const pid of item.customProducts) {
                    const key = pid.toString();
                    productCounts[key] = (productCounts[key] || 0) + 1;
                }
                for (const pid of Object.keys(productCounts)) {
                    await Product.findByIdAndUpdate(pid, { $inc: { stock: productCounts[pid] } });
                }
                continue;
            }

            const packUnits = item.pack?.units || 1;
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity * packUnits }
            });
        }

        // 🧾 Update order
        order.orderStatus = "Cancelled";
        order.cancelledAt = new Date();

        // 💳 If Razorpay and not paid yet
        if (
            order.paymentMethod === "RAZORPAY" &&
            order.paymentStatus === "Pending"
        ) {
            order.paymentStatus = "Failed";
        }

        await order.save();

        return res.status(200).json({
            message: "Order cancelled successfully",
            order,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

