import ProductNotification from "../models/ProductNotification.js";
import User from "../models/User.js";

export const notifyMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const user = await User.findById(userId);

        const already = await ProductNotification.findOne({
            user: userId,
            product: productId
        });

        if (already) {
            return res.status(400).json({ message: "Already subscribed" });
        }

        await ProductNotification.create({
            user: userId,
            product: productId,
            email: user.email
        });

        res.json({ message: "You will be notified" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};