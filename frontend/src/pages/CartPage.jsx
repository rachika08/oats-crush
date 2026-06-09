import React, { useEffect, useState } from "react";
import api from "../api/axios"; // your axios instance
import Footer from "../components/home/Footer";
import Navbar from "../components/Navbar";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH CART
  const fetchCart = async () => {
    try {
      setLoading(true);

      const res = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      // assuming backend: res.data.items
      setCartItems(res.data.items || []);

    } catch (error) {
      console.log("Cart fetch error:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // total price
  const getTotal = () => {
    return cartItems.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);
  };

  // loading state
  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading cart...
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="w-full min-h-screen bg-gray-50 p-6">

      <h1 className="text-2xl font-semibold mb-6">My Cart</h1>

      {/* EMPTY CART */}
      {cartItems.length === 0 ? (
        <div className="text-center mt-20">
          <h2 className="text-xl font-medium">Your cart is empty 🛒</h2>
          <p className="text-gray-500 mt-2">
            Add some products to continue shopping
          </p>
        </div>
      ) : (

        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT - ITEMS */}
          <div className="flex-1 space-y-4">

            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-white p-4 rounded shadow"
              >

                <img
                  src={item.product.image}
                  className="w-20 h-20 object-cover rounded"
                  alt=""
                />

                <div className="ml-4 flex-1">
                  <h2 className="font-medium">
                    {item.product.name}
                  </h2>

                  <p className="text-gray-600">
                    ₹{item.product.price}
                  </p>

                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className="font-semibold">
                  ₹{item.product.price * item.quantity}
                </div>

              </div>
            ))}

          </div>

          {/* RIGHT - SUMMARY */}
          <div className="w-full lg:w-1/3 bg-white p-4 rounded shadow h-fit">

            <h2 className="text-lg font-semibold mb-4">
              Order Summary
            </h2>

            <div className="flex justify-between mb-2">
              <span>Total Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span>Total Price</span>
              <span className="font-semibold">
                ₹{getTotal()}
              </span>
            </div>

            <button className="w-full bg-black text-white py-2 rounded">
              Proceed to Checkout
            </button>

          </div>

        </div>
      )}
    </div>
    <Footer/>
    </>
  );
}