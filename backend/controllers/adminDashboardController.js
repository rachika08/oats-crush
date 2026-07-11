import Order from "../models/orderModel.js";
import User from "../models/User.js";
import Review from "../models/Review.js";

export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalOrders,
            totalCustomers,
            revenueAgg,
            avgRatingAgg,
            recentOrders,
            topProductsAgg,
        ] = await Promise.all([
            Order.countDocuments(),

            User.countDocuments({ role: "user" }),

            Order.aggregate([
                { $match: { orderStatus: { $ne: "Cancelled" } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } },
            ]),

            Review.aggregate([
                { $group: { _id: null, avg: { $avg: "$rating" } } },
            ]),

            Order.find()
                .populate("user", "name")
                .populate("items.product", "name")
                .sort({ createdAt: -1 })
                .limit(10),

            Order.aggregate([
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.product",
                        unitsSold: { $sum: "$items.quantity" },
                        revenue: {
                            $sum: {
                                $multiply: ["$items.price", "$items.quantity"],
                            },
                        },
                    },
                },
                { $sort: { unitsSold: -1 } },
                { $limit: 4 },
                {
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "_id",
                        as: "product",
                    },
                },
                { $unwind: "$product" },
                {
                    $project: {
                        _id: 0,
                        productId: "$product._id",
                        name: "$product.name",
                        image: "$product.image",
                        unitsSold: 1,
                        revenue: 1,
                    },
                },
            ]),
        ]);

        return res.status(200).json({
            totalRevenue: revenueAgg[0]?.total || 0,
            totalOrders,
            totalCustomers,
            avgRating: avgRatingAgg[0]?.avg
                ? Number(avgRatingAgg[0].avg.toFixed(1))
                : 0,
            recentOrders,
            topProducts: topProductsAgg,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};