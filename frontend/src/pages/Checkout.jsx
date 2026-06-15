import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import { useNavigate } from "react-router";

export default function Checkout() {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const navigate = useNavigate();

    useEffect(() => {
        fetchAddresses();
        fetchCart();
    }, []);

    const fetchAddresses = async () => {
        try {
            const res = await api.get("/address");
            setAddresses(res.data);

            if (res.data.length > 0) {
                setSelectedAddress(res.data[0]._id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCart = async () => {
        try {
            const res = await api.get("/cart");

            setCart(res.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        if (!cart) return 0;

        return cart.items.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);
    };

    const handlePlaceOrder = async () => {
        try {
            if (!selectedAddress) {
                alert("Please select an address");
                return;
            }

            const res = await api.post("/order", {
                addressId: selectedAddress,
                paymentMethod,
            });
            if (paymentMethod === "COD") {
                navigate(`/order/${res.data.order._id}`);
            } else {
                // Razorpay flow will go here later
                alert("Open Razorpay Checkout");
            }
            // navigate(`/order/${res.data.order._id}`);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Failed to place order"
            );
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

    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-10">
                <h2 className="text-3xl font-bold mb-6">
                    Checkout
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Address Section */}
                    <div className="md:col-span-7">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
                            <div className="p-6">
                                <h4 className="text-xl font-semibold mb-3">
                                    Shipping Address
                                </h4>

                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                                    onClick={() =>
                                        navigate("/addresses")
                                    }
                                >
                                    Add New Address
                                </button>

                                {addresses.length === 0 ? (
                                    <p>No address found.</p>
                                ) : (
                                    addresses.map((address) => (
                                        <div
                                            key={address._id}
                                            className="border rounded p-3 mb-3"
                                        >
                                            <div>
                                                <input
                                                    className="mr-2"
                                                    type="radio"
                                                    name="address"
                                                    value={address._id}
                                                    checked={
                                                        selectedAddress ===
                                                        address._id
                                                    }
                                                    onChange={(e) =>
                                                        setSelectedAddress(
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <label>
                                                    <strong>
                                                        {
                                                            address.fullName
                                                        }
                                                    </strong>

                                                    <br />

                                                    {
                                                        address.addressLine1
                                                    }

                                                    {address.addressLine2 &&
                                                        `, ${address.addressLine2}`}

                                                    <br />

                                                    {
                                                        address.city
                                                    }
                                                    ,{" "}
                                                    {
                                                        address.state
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        address.pincode
                                                    }

                                                    <br />

                                                    Phone:{" "}
                                                    {
                                                        address.phone
                                                    }
                                                </label>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6">
                                <h4 className="text-xl font-semibold mb-3">
                                    Payment Method
                                </h4>

                                <div>
                                    <input
                                        className="mr-2"
                                        type="radio"
                                        checked={
                                            paymentMethod ===
                                            "COD"
                                        }
                                        onChange={() =>
                                            setPaymentMethod(
                                                "COD"
                                            )
                                        }
                                    />

                                    <label>
                                        Cash On Delivery
                                    </label>
                                </div>
                                <div>
                                    <input
                                        className="mr-2"
                                        type="radio"
                                        value="RAZORPAY"
                                        checked={paymentMethod === "RAZORPAY"}
                                        onChange={() => setPaymentMethod("RAZORPAY")}
                                    />
                                    <label>Pay Online (Razorpay)</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="md:col-span-5">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6">
                                <h4 className="text-xl font-semibold mb-3">
                                    Order Summary
                                </h4>

                                {cart?.items?.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex justify-between items-center border-b border-gray-200 py-3"
                                    >
                                        <div>
                                            <h6 className="font-medium mb-1">
                                                {
                                                    item.product
                                                        .name
                                                }
                                            </h6>

                                            <small>
                                                Qty:{" "}
                                                {
                                                    item.quantity
                                                }
                                            </small>
                                        </div>

                                        <strong>
                                            ₹
                                            {item.product
                                                .price *
                                                item.quantity}
                                        </strong>
                                    </div>
                                ))}

                                <div className="flex justify-between mt-4">
                                    <h5 className="text-lg font-semibold">
                                        Total
                                    </h5>

                                    <h5 className="text-lg font-semibold">
                                        ₹
                                        {calculateTotal()}
                                    </h5>
                                </div>

                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                                    onClick={
                                        handlePlaceOrder
                                    }
                                >
                                    Place Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}