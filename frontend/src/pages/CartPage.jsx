// import React, { useEffect, useState } from "react";
// import api from "../api/axios";
// import Footer from "../components/home/Footer";
// import Navbar from "../components/Navbar";
// import { useNavigate } from "react-router";

// export default function CartPage() {
//   // Load cart instantly from localStorage
//   const [cartItems, setCartItems] = useState(() => {
//     const savedCart = localStorage.getItem("cartItems");
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   const [loading, setLoading] = useState(
//     localStorage.getItem("cartItems") ? false : true
//   );

//   const navigate = useNavigate();

//   // Fetch latest cart from backend
//   const fetchCart = async () => {
//     try {
//       if (cartItems.length === 0) {
//         setLoading(true);
//       }

//       const res = await api.get("/cart", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const items = res.data.items || [];

//       setCartItems(items);

//       // Save latest cart
//       localStorage.setItem("cartItems", JSON.stringify(items));
//     } catch (error) {
//       console.log("Cart fetch error:", error);

//       // Keep localStorage cart visible if API fails
//       if (cartItems.length === 0) {
//         setCartItems([]);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   // Total price
//   const getTotal = () => {
//     return cartItems.reduce((acc, item) => {
//       return acc + item.product.price * item.quantity;
//     }, 0);
//   };

//   // Update quantity instantly (Optimistic UI)
//   // const updateQuantity = async (productId, newQty) => {
//   //    console.log(productId, newQty);
//   //   if (newQty < 1) return;

//   //   const updatedCart = cartItems.map((item) =>
//   //     item.product._id === productId
//   //       ? { ...item, quantity: newQty }
//   //       : item
//   //   );

//   //   setCartItems(updatedCart);
//   //   localStorage.setItem("cartItems", JSON.stringify(updatedCart));

//   //   try {
//   //     await api.put(
//   //       "/cart/update",
//   //       { productId, quantity: newQty },
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${localStorage.getItem("token")}`,
//   //         },
//   //       }
//   //     );
//   //   } catch (error) {
//   //     console.log(error);
//   //     fetchCart(); // restore backend state if failed
//   //   }
//   // };

//   const updateQuantity = async (productId, newQty) => {
//   if (newQty < 1) return;

//   setCartItems(prev => {
//     const updatedCart = prev.map((item) =>
//       item.product._id === productId
//         ? { ...item, quantity: newQty }
//         : item
//     );
//     localStorage.setItem("cartItems", JSON.stringify(updatedCart));
//     return updatedCart;
//   });

//   try {
//     await api.put(
//       "/cart/update",
//       { productId, quantity: newQty },
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );
//   } catch (error) {
//     console.log(error);
//     fetchCart();
//   }
// };

//   // Remove item instantly
//   const removeItem = async (productId) => {
//     const updatedCart = cartItems.filter(
//       (item) => item.product._id !== productId
//     );

//     setCartItems(updatedCart);
//     localStorage.setItem("cartItems", JSON.stringify(updatedCart));

//     try {
//       await api.delete(`/cart/remove/${productId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//     } catch (error) {
//       console.log(error);
//       fetchCart();
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="w-full min-h-screen bg-gray-50 px-6 pt-28 sm:pt-32 pb-6">
//         <h1 className="text-2xl font-semibold mb-2">My Cart</h1>

//         {loading && (
//           <p className="text-gray-500 mb-4">
//             Refreshing cart...
//           </p>
//         )}

//         {/* EMPTY CART */}
//         {cartItems.length === 0 ? (
//           <div className="text-center mt-20">
//             <h2 className="text-xl font-medium">
//               Your cart is empty 🛒
//             </h2>

//             <p className="text-gray-500 mt-2">
//               Add some products to continue shopping
//             </p>
//           </div>
//         ) : (
//           <div className="flex flex-col lg:flex-row gap-6">
//             {/* LEFT - ITEMS */}
//             <div className="flex-1 space-y-4">
//               {cartItems.map((item) => (
//                 <div
//                   key={item.product._id}
//                   className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row items-center gap-4"
//                 >
//                   {/* Product Image */}
//                   <img
//                     onClick={() =>
//                       navigate(`/product/${item.product._id}`)
//                     }
//                     src={item.product.image}
//                     alt={item.product.name}
//                     className="w-24 h-24 object-cover rounded cursor-pointer"
//                   />

//                   {/* Product Info */}
//                   <div className="flex-1 w-full">
//                     <h2 className="font-semibold text-lg">
//                       {item.product.name}
//                     </h2>

//                     <p className="text-gray-600">
//                       ₹{item.product.price}
//                     </p>

//                     {/* Quantity Controls */}
//                     <div className="flex items-center gap-3 mt-3">
//                       <button
//                         onClick={() =>
                          
//                           updateQuantity(
//                             item.product._id,
//                             item.quantity - 1
//                           )
                          
//                         }
//                         className="w-8 h-8 border rounded"
//                       >
//                         -
//                       </button>

//                       <span className="font-medium">
//                         {item.quantity}
//                       </span>

//                       <button
//                         onClick={() =>
//                           updateQuantity(
//                             item.product._id,
//                             item.quantity + 1
//                           )
//                         }
//                         className="w-8 h-8 border rounded"
//                       >
//                         +
//                       </button>
//                     </div>

//                     {/* Remove Button */}
//                     <button
//                       onClick={() =>
//                         removeItem(item.product._id)
//                       }
//                       className="text-red-500 text-sm mt-3"
//                     >
//                       Remove
//                     </button>
//                   </div>

//                   {/* Item Total */}
//                   <div className="text-lg font-semibold">
//                     ₹{item.product.price * item.quantity}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* RIGHT - SUMMARY */}
//             <div className="w-full lg:w-1/3 bg-white p-4 rounded shadow h-fit">
//               <h2 className="text-lg font-semibold mb-4">
//                 Order Summary
//               </h2>

//               <div className="flex justify-between mb-2">
//                 <span>Total Items</span>
//                 <span>{cartItems.length}</span>
//               </div>

//               <div className="flex justify-between mb-4">
//                 <span>Total Price</span>

//                 <span className="font-semibold">
//                   ₹{getTotal()}
//                 </span>
//               </div>

//               <button
//                 onClick={() => navigate("/checkout")}
//                 className="w-full bg-black text-white py-2 rounded"
//               >
//                 Proceed to Checkout
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <Footer />
//     </>
//   );
// }
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Footer from "../components/home/Footer";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router";

export default function CartPage() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [loading, setLoading] = useState(
    localStorage.getItem("cartItems") ? false : true
  );

  const navigate = useNavigate();

  // FETCH CART
  const fetchCart = async () => {
    try {
      setLoading(true);

      const res = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const items = res.data.items || [];
      console.log(items);

      setCartItems(items);
      localStorage.setItem("cartItems", JSON.stringify(items));
    } catch (error) {
      console.log("Cart fetch error:", error);

      if (cartItems.length === 0) {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // TOTAL PRICE (PACK-AWARE)
  const getTotal = () => {
  return cartItems.reduce((acc, item) => {
    return acc + item.pack.price * item.quantity;
  }, 0);
};

  // UPDATE QUANTITY
  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;

    setCartItems((prev) => {
      const updatedCart = prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQty }
          : item
      );

      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });

    try {
      await api.put(
        "/cart/update",
        { productId, quantity: newQty },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
      fetchCart();
    }
  };

  // REMOVE ITEM
  const removeItem = async (productId) => {
    const updatedCart = cartItems.filter(
      (item) => item.product._id !== productId
    );

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    try {
      await api.delete(`/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.log(error);
      fetchCart();
    }
  };

  return (
    <>
      <Navbar />

      <div className="w-full min-h-screen bg-gray-50 px-6 pt-28 sm:pt-32 pb-6">
        <h1 className="text-2xl font-semibold mb-2">My Cart</h1>

        {loading && (
          <p className="text-gray-500 mb-4">
            Refreshing cart...
          </p>
        )}

        {/* EMPTY CART */}
        {cartItems.length === 0 ? (
          <div className="text-center mt-20">
            <h2 className="text-xl font-medium">
              Your cart is empty 🛒
            </h2>
            <p className="text-gray-500 mt-2">
              Add some products to continue shopping
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT - ITEMS */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => {
                const price =item.pack.price;
                  // item.pack?.price || item.product.price;

                const units = item.pack?.units || 1;

                return (
                  <div
                    key={`${item.product._id}-${item.pack?.label}`}
                    className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row items-center gap-4"
                  >
                    {/* IMAGE */}
                    <img
                      onClick={() =>
                        navigate(`/product/${item.product._id}`)
                      }
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded cursor-pointer"
                    />

                    {/* INFO */}
                    <div className="flex-1 w-full">
                      <h2 className="font-semibold text-lg">
                        {item.product.name}
                      </h2>

                      {/* PACK INFO */}
                      <p className="text-sm text-gray-500">
                        {item.pack?.label || "Pack of 1"}
                      </p>

                      <p className="text-xs text-gray-400">
                        {units} units per pack
                      </p>

                      <p className="text-gray-600 mt-1">
                        ₹{price * item.quantity}
                      </p>

                      {/* QUANTITY */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.quantity - 1
                            )
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
                            updateQuantity(
                              item.product._id,
                              item.quantity + 1
                            )
                          }
                          className="w-8 h-8 border rounded"
                        >
                          +
                        </button>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          removeItem(item.product._id)
                        }
                        className="text-red-500 text-sm mt-3"
                      >
                        Remove
                      </button>
                    </div>

                    {/* ITEM TOTAL */}
                    <div className="text-lg font-semibold">
                      ₹{price * item.quantity}
                    </div>
                  </div>
                );
              })}
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

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-black text-white py-2 rounded"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}