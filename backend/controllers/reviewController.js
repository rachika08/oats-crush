

import User from "../models/User.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

export const postReviews = async (req, res) => {
    try {
        const user = req.user.id;

        if (!user) {
            return res.status(401).json({ message: "Please login first" });
        }

        const { productId } = req.params;
        const { rating, comments } = req.body;

        // Check if product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const review = await Review.create({
            user,
            product: productId,
            rating,
            comments,
        });

        res.status(201).json(review);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({
            product: productId,
        }).populate("user", "name");

        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};