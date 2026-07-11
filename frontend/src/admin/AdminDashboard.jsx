import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Package, Users, Star, ArrowRight } from "lucide-react";
import AdminLayout from "./AdminLayout";
import api from "../api/axios.js";

const formatRevenue = (amount) => {
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return `${amount}`;
};

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")) || {};

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get("/admin/dashboard-stats");
            setStats(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const todayStr = new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const cards = [
        {
            icon: ShoppingCart,
            label: "Total Revenue",
            value: stats ? `₹${formatRevenue(stats.totalRevenue)}` : "—",
        },
        {
            icon: Package,
            label: "Total Orders",
            value: stats?.totalOrders ?? "—",
        },
        {
            icon: Users,
            label: "Total Customers",
            value: stats?.totalCustomers ?? "—",
        },
        {
            icon: Star,
            label: "Avg. Rating",
            value: stats?.avgRating || "—",
        },
    ];

    return (
        <AdminLayout>
            {/* Greeting banner */}
            <div className="bg-black rounded-2xl px-6 sm:px-8 py-7 mb-8">
                <h1 className="font-heading text-xl sm:text-2xl text-white">
                    Good Morning, <span className="text-brand-orange">{user.name || "Admin"}!</span>
                </h1>
                <p className="font-body text-sm text-gray-400 mt-2">
                    Here's what's happening with Oats Crush today — {todayStr}
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
                {cards.map(({ icon: Icon, label, value }) => (
                    <div
                        key={label}
                        className="bg-white border border-gray-200 rounded-2xl p-5"
                    >
                        <div className="w-10 h-10 rounded-lg border border-brand-orange/30 flex items-center justify-center mb-4">
                            <Icon size={18} className="text-brand-orange" />
                        </div>
                        <p className="font-heading text-2xl sm:text-3xl">
                            {loading ? "…" : value}
                        </p>
                        <p className="font-body text-sm text-gray-500 mt-1">{label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders + Top Products */}
            <div className="grid lg:grid-cols-[1fr_380px] gap-6">
                {/* Recent Orders */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-heading text-lg">Recent Orders</h2>
                        <button
                            onClick={() => navigate("/admin/orders")}
                            className="font-body text-sm text-brand-orange flex items-center gap-1 cursor-pointer"
                        >
                            View All <ArrowRight size={14} />
                        </button>
                    </div>

                    {!loading && stats?.recentOrders?.length === 0 && (
                        <p className="font-body text-sm text-gray-500">No orders yet.</p>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-100 text-left font-body text-gray-600">
                                    <th className="px-3 py-2 rounded-l-lg font-medium">Order Id</th>
                                    <th className="px-3 py-2 font-medium">Customer</th>
                                    <th className="px-3 py-2 font-medium">Product</th>
                                    <th className="px-3 py-2 rounded-r-lg font-medium text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recentOrders?.map((order) => {
                                    const firstItem = order.items?.[0];
                                    const extraCount = (order.items?.length || 1) - 1;

                                    return (
                                        <tr
                                            key={order._id}
                                            onClick={() => navigate(`/admin/orders/${order._id}`)}
                                            className="border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
                                        >
                                            <td className="px-3 py-3 font-medium">
                                                #OC{order._id.slice(-4).toUpperCase()}
                                            </td>
                                            <td className="px-3 py-3">{order.user?.name || "—"}</td>
                                            <td className="px-3 py-3 text-gray-600">
                                                {firstItem?.product?.name || firstItem?.pack?.label || "Item"}
                                                {extraCount > 0 && ` +${extraCount} more`}
                                            </td>
                                            <td className="px-3 py-3 text-right font-medium">
                                                ₹{order.totalAmount}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-heading text-lg">Top Products</h2>
                        <button
                            onClick={() => navigate("/admin/products")}
                            className="font-body text-sm text-brand-orange flex items-center gap-1 cursor-pointer"
                        >
                            Manage <ArrowRight size={14} />
                        </button>
                    </div>

                    {!loading && stats?.topProducts?.length === 0 && (
                        <p className="font-body text-sm text-gray-500">No sales data yet.</p>
                    )}

                    <div className="space-y-3">
                        {stats?.topProducts?.map((product) => (
                            <div
                                key={product.productId}
                                className="flex items-center gap-3 border border-gray-100 rounded-xl p-3"
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                                />
                                <div className="min-w-0">
                                    <p className="font-heading text-sm text-brand-orange truncate">
                                        {product.name}
                                    </p>
                                    <p className="font-body text-xs text-gray-500">
                                        {product.unitsSold} products sold
                                    </p>
                                    <p className="font-body text-xs font-medium">
                                        ₹{product.revenue.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}