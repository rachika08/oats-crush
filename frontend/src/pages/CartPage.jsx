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


  const updateQuantity = async (productId, newQty) => {
    try {
      await api.put(
        "/cart/update",
        { productId, quantity: newQty },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      fetchCart(); // refresh UI
    } catch (error) {
      console.log(error);
    }
  };


  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      fetchCart(); // refresh UI
    } catch (error) {
      console.log(error);
    }
  };

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
                className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row items-center gap-4"
              >
                {/* Product Image */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />

                {/* Product Info */}
                <div className="flex-1 w-full">
                  <h2 className="font-semibold text-lg">
                    {item.product.name}
                  </h2>

                  <p className="text-gray-600">
                    ₹{item.product.price}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity - 1)
                      }
                      className="w-8 h-8 border rounded"
                    >
                      -
                    </button>

                    <span className="font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                      className="w-8 h-8 border rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="text-red-500 text-sm mt-3"
                  >
                    Remove
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-lg font-semibold">
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