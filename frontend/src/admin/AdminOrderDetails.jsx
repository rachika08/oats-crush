import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { FREE_BLENDER_THRESHOLD } from "../utils/pricing";

export default function AdminOrderDetails() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/admin/orders/${id}`);

            setOrder(res.data);
            setStatus(res.data.orderStatus);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async () => {
        try {
            await api.patch(`/admin/orders/${id}/status`, {
                orderStatus: status,
            });

            alert("Order status updated");

            fetchOrder();
        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.message ||
                "Failed to update status"
            );
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <h3 className="text-xl font-semibold">
                        Loading...
                    </h3>
                </div>
            </>
        );
    }

    if (!order) {
        return (
            <>
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <h3 className="text-xl font-semibold">
                        Order not found
                    </h3>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6">
                    Admin Order Details
                </h2>

                {/* Customer */}

                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h4 className="text-xl font-semibold mb-4">
                        Customer Details
                    </h4>

                    <p className="mb-2">
                        <strong>Name:</strong>{" "}
                        {order.user?.name}
                    </p>

                    <p>
                        <strong>Email:</strong>{" "}
                        {order.user?.email}
                    </p>
                </div>

                {/* Address */}

                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h4 className="text-xl font-semibold mb-4">
                        Delivery Address
                    </h4>

                    <p>{order.address?.fullName}</p>

                    <p>{order.address?.phone}</p>

                    <p>{order.address?.addressLine1}</p>

                    <p>
                        {order.address?.city},{" "}
                        {order.address?.state}
                    </p>

                    <p>{order.address?.pincode}</p>
                </div>

                {/* Products */}

                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h4 className="text-xl font-semibold mb-4">
                        Ordered Products
                    </h4>

                    {order.items.map((item) => (
                        <div
                            key={item._id}
                            className="border-b py-4 last:border-b-0"
                        >
                            <h5 className="text-lg font-medium">
                                {item.product?.name}
                            </h5>

                            <p>
                                Quantity: {item.quantity}
                            </p>

                            <p>
                                Price: ₹{item.price}
                            </p>

                            <p>
                                Subtotal: ₹
                                {item.price * item.quantity}
                            </p>
                        </div>
                    ))}
                </div>

{/* Summary */}

                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h4 className="text-xl font-semibold mb-4">
                        Order Summary
                    </h4>

                    {(order.subtotal ?? 0) >= FREE_BLENDER_THRESHOLD && (
                        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg px-4 py-3 mb-4">
                            <p className="font-semibold text-yellow-800">
                                🎁 Include Free Electric Juice Blender
                            </p>
                            <p className="text-sm text-yellow-700 mt-1">
                                Order subtotal (₹{order.subtotal}) qualifies for the ₹2999+ free blender reward — make sure it's packed with this shipment.
                            </p>
                        </div>
                    )}

                    <p className="mb-2">
                        <strong>Total:</strong> ₹
                        {order.totalAmount}
                    </p>

                    <p className="mb-2">
                        <strong>Payment Method:</strong>{" "}
                        {order.paymentMethod}
                    </p>

                    <p className="mb-2">
                        <strong>Payment Status:</strong>{" "}
                        {order.paymentStatus}
                    </p>
                    <p className="mb-2">
                        <strong>Razorpay Payment Id:</strong>{" "}
                        {order.razorpayPaymentId}
                    </p>
                    <p className="mb-2">
                        <strong>Paid at:</strong>{" "}
                        {new Date(order.paidAt).toLocaleString()}
                    </p>

                    <p>
                        <strong>Current Status:</strong>{" "}
                        {order.orderStatus}
                    </p>
                </div>

                {/* Status Update */}

                <div className="bg-white shadow rounded-lg p-6">
                    <h4 className="text-xl font-semibold mb-4">
                        Update Status
                    </h4>

                    <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >
                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Processing">
                            Processing
                        </option>

                        <option value="Shipped">
                            Shipped
                        </option>

                        <option value="Delivered">
                            Delivered
                        </option>

                        <option value="Cancelled">
                            Cancelled
                        </option>
                    </select>

                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                        onClick={updateStatus}
                    >
                        Update Status
                    </button>
                </div>
            </div>
        </>
    );
}