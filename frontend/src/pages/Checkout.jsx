import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import { useNavigate } from "react-router";
import AddressModal from "../components/AddressModal";

export default function Checkout() {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
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

    const handleSaveAddress = async (formData) => {
        try {
            const res = await api.post("/address", formData);
            await fetchAddresses();
            setSelectedAddress(res.data._id);
            setIsAddressModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to save address");
        }
    };

    const fetchCart = async () => {
        try {
            const res = await api.get("/cart");
            setCart(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ FIXED TOTAL (supports custom box + normal product)
    const calculateTotal = () => {
        if (!cart) return 0;

        return cart.items.reduce((total, item) => {
            // CUSTOM BOX
            if (item.isCustomBox) {
                return total + (item.customPrice || 0);
            }

            // NORMAL PRODUCT
            const packPrice = item.pack?.price || 0;
            return total + packPrice * (item.quantity || 1);
        }, 0);
    };

    const handlePlaceOrder = async () => {
        try {
            if (!selectedAddress) {
                alert("Please select an address");
                return;
            }

            const orderRes = await api.post("/order", {
                addressId: selectedAddress,
                paymentMethod,
            });

            const order = orderRes.data.order;

            if (paymentMethod === "COD") {
                navigate(`/order/${order._id}`);
                return;
            }

            const paymentRes = await api.post("/payment/create-order", {
                orderId: order._id,
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: paymentRes.data.amount,
                currency: paymentRes.data.currency,
                order_id: paymentRes.data.orderId,
                name: "Oats Crush",
                description: "Order Payment",

                handler: async function (response) {
                    try {
                        await api.post("/payment/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        navigate(`/order/${order._id}`);
                    } catch (error) {
                        console.log("Verification failed", error);
                    }
                },

                theme: { color: "#3399cc" },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            alert(error.response?.data?.message || "Failed to place order");
        }


        finally {
            setIsPlacingOrder(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-10">
                    Loading...
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-10">
                <h2 className="text-3xl font-bold mb-6">Checkout</h2>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* LEFT SIDE */}
                    <div className="md:col-span-7">

                        {/* ADDRESS */}
                        <div className="bg-white rounded-lg shadow-sm border mb-4">
                            <div className="p-6">
                                <h4 className="text-xl font-semibold mb-3">
                                    Shipping Address
                                </h4>

                                {addresses.map((address) => (
                                    <div key={address._id} className="border p-3 mb-3 rounded">
                                        <input
                                            type="radio"
                                            checked={selectedAddress === address._id}
                                            onChange={() => setSelectedAddress(address._id)}
                                        />
                                        <label className="ml-2">
                                            <strong>{address.fullName}</strong>
                                            <br />
                                            {address.addressLine1}
                                            {address.addressLine2 && `, ${address.addressLine2}`}
                                            <br />
                                            {address.city}, {address.state} - {address.pincode}
                                            <br />
                                            Phone: {address.phone}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PAYMENT */}
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-6">
                                <h4 className="text-xl font-semibold mb-3">
                                    Payment Method
                                </h4>

                                <label className="block">
                                    <input
                                        type="radio"
                                        checked={paymentMethod === "COD"}
                                        onChange={() => setPaymentMethod("COD")}
                                    />
                                    <span className="ml-2">Cash On Delivery</span>
                                </label>

                                <label className="block mt-2">
                                    <input
                                        type="radio"
                                        checked={paymentMethod === "RAZORPAY"}
                                        onChange={() => setPaymentMethod("RAZORPAY")}
                                    />
                                    <span className="ml-2">Pay Online</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="md:col-span-5">
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-6">

                                <h4 className="text-xl font-semibold mb-3">
                                    Order Summary
                                </h4>

                                {cart?.items?.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex justify-between border-b py-3"
                                    >
                                        <div>

                                            {/* CUSTOM BOX */}
                                            {item.isCustomBox ? (
                                                <>
                                                    <p className="font-medium">
                                                        Custom Box ({item.packSize})
                                                    </p>
                                                    <small className="text-gray-500">
                                                        {item.customProducts?.length || 0} items
                                                    </small>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="font-medium">
                                                        {item.product?.name}
                                                    </p>
                                                    <small>Qty: {item.quantity}</small>

                                                    {item.pack?.label && (
                                                        <small className="block text-gray-500">
                                                            {item.pack.label}
                                                        </small>
                                                    )}
                                                </>
                                            )}

                                        </div>

                                        {/* PRICE */}
                                        <strong>
                                            ₹
                                            {item.isCustomBox
                                                ? item.customPrice
                                                : (item.pack?.price || 0) * item.quantity}
                                        </strong>
                                    </div>
                                ))}

                                {/* TOTAL */}
                                <div className="flex justify-between mt-4 font-bold">
                                    <span>Total</span>
                                    <span>₹{calculateTotal()}</span>
                                </div>

                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full"
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
            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSave={handleSaveAddress}
                initialData={null}
            />
        </>
    );
}
