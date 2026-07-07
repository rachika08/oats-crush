import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BadgePercent } from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import { FREE_BLENDER_THRESHOLD } from "../utils/pricing";

const STATUS_STYLES = {
    Pending: "text-yellow-600 border-yellow-600",
    Processing: "text-yellow-600 border-yellow-600",
    Shipped: "text-blue-600 border-blue-600",
    Delivered: "text-green-600 border-green-600",
    Cancelled: "text-red-500 border-red-500",
};

export default function OrderDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/order/${id}`);
            setOrder(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-10">
                    <h3 className="text-xl font-semibold">
                        Loading...
                    </h3>
                </div>
                <Footer />
            </>
        );
    }

    if (!order) {
        return (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-10">
                    <h3 className="text-xl font-semibold">
                        Order not found
                    </h3>
                </div>
                <Footer />
            </>
        );
    }

    const handleCancel = async () => {
        try {
            await api.put(
                `/order/${order._id}/cancel`
            );

            alert("Order cancelled successfully");

            fetchOrder(); // refresh UI
        } catch (err) {
            alert(
                err.response?.data?.message ||
                    "Cancel failed"
            );
        }
    };

const subtotal = order.subtotal ?? 0;
const shippingFee = order.shippingFee ?? 0;
const discount = order.discount ?? 0;
const grandTotal = order.totalAmount ?? subtotal;

    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-37 pb-16 sm:pb-20">

                <button
                    onClick={() => navigate("/profile?tab=orders")}
                    className="flex items-center gap-2 font-body text-sm text-gray-500 hover:text-brand-orange transition cursor-pointer mb-6"
                >
                    <ArrowLeft size={16} />
                    Back to Orders
                </button>

                <div className="mb-8">
    <h2 className="font-heading text-2xl sm:text-3xl mb-4">
        ORDER SUMMARY
    </h2>

    <div className="flex items-center justify-between flex-wrap gap-4">
        <span
            className={`inline-block border-2 rounded-full px-6 py-2 font-heading text-sm uppercase tracking-wide ${
                STATUS_STYLES[order.orderStatus] ||
                "text-gray-500 border-gray-300"
            }`}
        >
            {order.orderStatus}
        </span>

        {order.orderStatus === "Pending" && (
            <button
                onClick={handleCancel}
                className="bg-red-500 text-white font-heading text-sm px-6 py-2.5 rounded-full hover:-translate-y-0.5 transition cursor-pointer shadow-md"
            >
                CANCEL ORDER
            </button>
        )}
    </div>
</div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left column */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Items in this Order */}
                        <div className="border border-gray-200 rounded-2xl p-6">
                            <p className="font-body font-semibold text-brand-orange text-sm mb-5">
                                Items in this Order
                            </p>

                            <div className="space-y-5">
                                {order.items.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex gap-4"
                                    >
                                        <img
                                            src={item.product?.image}
                                            alt={item.product?.name}
                                            className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-gray-50"
                                        />

                                        <div className="flex-1 flex justify-between gap-4">
                                            <div>
                                                <p className="font-body font-semibold text-base mb-1">
                                                    {item.product?.name}
                                                </p>
                                                <p className="font-body text-sm text-gray-500">
                                                    Quantity: {item.quantity}
                                                </p>
                                                {item.pack?.label && (
                                                    <p className="font-body text-sm text-gray-500">
                                                        {item.pack.label}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="text-right flex-shrink-0">
                                                <p className="font-body font-semibold text-lg">
                                                    ₹{item.price * item.quantity}
                                                </p>
                                                {item.quantity > 1 && (
                                                    <p className="font-body text-xs text-gray-400">
                                                        ₹{item.price} per item
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Details */}
                        <div className="border border-gray-200 rounded-2xl p-6">
                            <p className="font-body font-semibold text-brand-orange text-sm mb-4">
                                Delivery Details
                            </p>

                            <p className="font-body text-sm text-black mb-2">
                                Name:{" "}
                                <span className="font-semibold">
                                    {order.address?.fullName}
                                </span>
                            </p>

                            <p className="font-body text-sm text-black mb-2">
                                Address:{" "}
                                <span className="font-semibold">
                                    {order.address?.addressLine1}
                                    {order.address?.addressLine2 &&
                                        `, ${order.address.addressLine2}`}
                                    , {order.address?.city}, {order.address?.state},{" "}
                                    {order.address?.pincode}
                                </span>
                            </p>

                            <p className="font-body text-sm text-black">
                                Contact Number:{" "}
                                <span className="font-semibold">
                                    {order.address?.phone}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Bill Details */}
                        <div className="border border-gray-200 rounded-2xl p-6">
                            <p className="font-body font-semibold text-brand-orange text-sm mb-4">
                                Bill Details
                            </p>

                            <div className="space-y-3 font-body text-sm text-black">
                                <div className="flex justify-between">
                                    <span>Total Items</span>
                                    <span>{order.items.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className={shippingFee === 0 ? "text-green-600 font-semibold" : ""}>
                                        {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                                   </span>
                                </div>
{discount > 0 && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>Offer applied</span>
                                        <span>-₹{discount}</span>
                                   </div>
                                )}
                            </div>

                            {subtotal >= FREE_BLENDER_THRESHOLD && (
                                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 mt-4">
                                    <div className="flex items-center gap-2">
                                        <BadgePercent size={18} className="text-brand-orange" />
                                        <span className="font-body text-sm text-black">
                                            Free <span className="font-semibold">Electric Juice Blender</span> included
                                        </span>
                                    </div>
                                    <span className="bg-green-100 text-green-700 font-body text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                                        Free Gift
                                    </span>
                                </div>
                            )}

                            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                                <span className="font-body font-semibold text-base">
                                    Grand Total
                                </span>
                                <span className="font-body font-semibold text-lg">
                                    ₹{grandTotal}
                                </span>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="border border-gray-200 rounded-2xl p-6">
                            <p className="font-body font-semibold text-brand-orange text-sm mb-4">
                                Order Details
                            </p>

                            <div className="space-y-2 font-body text-sm text-black">
                                <p>
                                    Payment Method:{" "}
                                    <span className="font-semibold">
                                        {order.paymentMethod === "RAZORPAY"
                                            ? "Razorpay"
                                            : "Cash on Delivery"}
                                    </span>
                                </p>
                                <p>
                                    Status of Payment:{" "}
                                    <span className="font-semibold">
                                        {order.paymentStatus}
                                    </span>
                                </p>
                                <p>
                                    Order Placed On:{" "}
                                    <span className="font-semibold">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString("en-GB")}
                                    </span>
                                </p>
                                <p>
                                    Order ID:{" "}
                                    <span className="font-semibold">
                                        {order._id.slice(-6)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}