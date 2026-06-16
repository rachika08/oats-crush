import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";

export default function OrderDetails() {

    const { id } = useParams();

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

    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-10">

                <h2 className="text-3xl font-bold mb-6">
                    Order Details
                </h2>

                {/* Order Summary */}

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
                    <div className="p-6">

                        <h5 className="text-lg font-semibold mb-3">
                            Order #{order._id.slice(-6)}
                        </h5>

                        <p>
                            <strong>Status:</strong>{" "}
                            {order.orderStatus}
                        </p>

                        <p>
                            <strong>Payment:</strong>{" "}
                            {order.paymentMethod}
                        </p>

                        <p>
                            <strong>Payment Status:</strong>{" "}
                            {order.paymentStatus}
                        </p>

                        <p>
                            <strong>Total:</strong> ₹
                            {order.totalAmount}
                        </p>
                        {order.orderStatus === "Pending" && (
                            <button
                                onClick={handleCancel}
                                style={{ background: "red", color: "white" }}
                            >
                                Cancel Order
                            </button>
                        )}
                    </div>
                </div>

                {/* Address */}

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
                    <div className="p-6">

                        <h4 className="text-xl font-semibold mb-4">
                            Delivery Address
                        </h4>

                        <p>
                            {order.address.fullName}
                        </p>

                        <p>
                            {order.address.phone}
                        </p>

                        <p>
                            {order.address.addressLine1}
                        </p>

                        <p>
                            {order.address.city},{" "}
                            {order.address.state}
                        </p>

                        <p>
                            {order.address.pincode}
                        </p>

                    </div>
                </div>

                {/* Products */}

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">

                        <h4 className="text-xl font-semibold mb-3">
                            Ordered Products
                        </h4>

                        {order.items.map((item) => (

                            <div
                                key={item._id}
                                className="border-b border-gray-200 py-3 last:border-b-0"
                            >

                                <h5 className="text-lg font-semibold">
                                    {item.product?.name}
                                </h5>

                                <p>
                                    Quantity:
                                    {" "}
                                    {item.quantity}
                                </p>

                                <p>
                                    Price:
                                    {" "}
                                    ₹{item.price}
                                </p>

                                <p>
                                    Subtotal:
                                    {" "}
                                    ₹
                                    {item.price *
                                        item.quantity}
                                </p>

                            </div>

                        ))}


                    </div>
                </div>

            </div>

            <Footer />
        </>
    );
}