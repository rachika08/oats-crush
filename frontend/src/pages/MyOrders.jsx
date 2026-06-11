import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/order");
            console.log(res);
            setOrders(res.data);
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
                        Loading orders...
                    </h3>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-10">
                <h2 className="text-3xl font-bold mb-6">
                    My Orders
                </h2>

                {orders.length === 0 ? (
                    <div className="bg-blue-100 text-blue-800 border border-blue-200 rounded-lg p-4">
                        You haven't placed any orders yet.
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4"
                        >
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h5 className="text-lg font-semibold mb-1">
                                            Order #{order._id.slice(-6)}
                                        </h5>

                                        <small className="text-gray-500">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString()}
                                        </small>
                                    </div>

                                    <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                                        {order.orderStatus}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <strong>
                                        Total Amount:
                                    </strong>{" "}
                                    ₹{order.totalAmount}
                                </div>

                                <div className="mb-3">
                                    <strong>
                                        Payment:
                                    </strong>{" "}
                                    {order.paymentMethod}
                                </div>

                                <div className="mb-3">
                                    <strong>
                                        Items:
                                    </strong>

                                    <ul className="mt-2 list-disc list-inside">
                                        {order.items.map((item) => (
                                            <li key={item._id}>
                                                {item.product?.name} ×{" "}
                                                {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                                    onClick={() =>
                                        navigate(
                                            `/order/${order._id}`
                                        )
                                    }
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Footer />
        </>
    );
}