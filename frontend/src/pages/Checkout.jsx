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
    const navigate=useNavigate();
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

    const handlePlaceOrder = () => {
        console.log({
            addressId: selectedAddress,
            paymentMethod
        });

        alert("Order API will be connected next.");
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container py-5">
                    <h3>Loading...</h3>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container py-5">
                <h2 className="mb-4">Checkout</h2>

                <div className="row">
                    {/* Address Section */}
                    <div className="col-md-7">
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h4 className="mb-3">
                                    Shipping Address
                                </h4>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => navigate("/addresses")}
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
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
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

                                                <label className="form-check-label">
                                                    <strong>
                                                        {address.fullName}
                                                    </strong>

                                                    <br />

                                                    {address.addressLine1}

                                                    {address.addressLine2 &&
                                                        `, ${address.addressLine2}`}

                                                    <br />

                                                    {address.city},{" "}
                                                    {address.state} -{" "}
                                                    {address.pincode}

                                                    <br />

                                                    Phone: {address.phone}
                                                </label>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h4 className="mb-3">
                                    Payment Method
                                </h4>

                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        checked={
                                            paymentMethod === "COD"
                                        }
                                        onChange={() =>
                                            setPaymentMethod("COD")
                                        }
                                    />

                                    <label className="form-check-label">
                                        Cash On Delivery
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="col-md-5">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h4 className="mb-3">
                                    Order Summary
                                </h4>

                                {cart?.items?.map((item) => (
                                    <div
                                        key={item._id}
                                        className="d-flex justify-content-between align-items-center border-bottom py-3"
                                    >
                                        <div>
                                            <h6 className="mb-1">
                                                {item.product.name}
                                            </h6>

                                            <small>
                                                Qty: {item.quantity}
                                            </small>
                                        </div>

                                        <strong>
                                            ₹
                                            {item.product.price *
                                                item.quantity}
                                        </strong>
                                    </div>
                                ))}

                                <div className="d-flex justify-content-between mt-4">
                                    <h5>Total</h5>

                                    <h5>
                                        ₹{calculateTotal()}
                                    </h5>
                                </div>

                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={handlePlaceOrder}
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
