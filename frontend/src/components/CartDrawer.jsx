import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, X } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";


export default function CartDrawer() {
  const { isCartOpen, closeCart } = useCart();

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ---------------- FETCH CART ----------------
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const items = res.data.items || [];

      setCartItems(items);
      localStorage.setItem("cartItems", JSON.stringify(items));
      localStorage.setItem("cartCount", items.length);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.log("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    if (!isCartOpen) return;
    fetchCart();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  useEffect(() => {
    if (!isCartOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeCart();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCartOpen, closeCart]);

  // ---------------- NORMAL PRODUCT UPDATE ----------------
  // const updateQuantity = async (productId, newQty) => {
  //   if (newQty < 1) return;

  //   setCartItems((prev) => {
  //     const updated = prev.map((item) =>
  //       !item.isCustomBox && item.product?._id === productId
  //         ? { ...item, quantity: newQty }
  //         : item
  //     );

  //     localStorage.setItem("cartItems", JSON.stringify(updated));
  //     return updated;
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
  const updateQuantity = async (itemId, newQty) => {
      if (newQty < 1) return;

      setCartItems((prev) => {
          const updated = prev.map((item) =>
              item._id === itemId ? { ...item, quantity: newQty } : item
          );
          localStorage.setItem("cartItems", JSON.stringify(updated));
          return updated;
      });

      try {
          await api.put(
              "/cart/update",
              { itemId, quantity: newQty },
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
      } catch (error) {
          console.log(error);
          fetchCart();
      }
  };

  // ---------------- REMOVE NORMAL ITEM ----------------
  // const removeItem = async (productId) => {
  //   const updated = cartItems.filter(
  //     (item) => item.product?._id !== productId
  //   );

  //   setCartItems(updated);
  //   localStorage.setItem("cartItems", JSON.stringify(updated));
  //   localStorage.setItem("cartCount", updated.length);
  //   window.dispatchEvent(new Event("cartUpdated"));

  //   try {
  //     await api.delete(`/cart/remove/${productId}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     fetchCart();
  //   }
  // };
  const removeItem = async (itemId) => {
    const updated = cartItems.filter((item) => item._id !== itemId);

    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    localStorage.setItem("cartCount", updated.length);
    window.dispatchEvent(new Event("cartUpdated"));

    try {
        await api.delete(`/cart/remove/${itemId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
    } catch (error) {
        console.log(error);
        fetchCart();
    }
  };

  // ---------------- REMOVE CUSTOM BOX ----------------
  const removeCustomBox = async (itemId) => {
    const updated = cartItems.filter((item) => item._id !== itemId);

    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    localStorage.setItem("cartCount", updated.length);
    window.dispatchEvent(new Event("cartUpdated"));

    try {
      await api.delete(`/cart/remove-custom-box/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.log(error);
      fetchCart();
    }
  };

  // ---------------- SUBTOTAL ----------------
  const subtotal = cartItems.reduce((acc, item) => {
    if (item.isCustomBox) {
      return acc + (item.customPrice || 0);
      // return acc + (item.customPrice || item.packSize * 100);
    }

    return acc + (item.pack?.price || 0) * (item.quantity || 1);
  }, 0);

  const grandTotal = cartItems.length > 0 ? subtotal + 0 : 0;

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  // ---------------- UI ----------------
  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 right-0 h-full sm:top-4 sm:right-4 sm:h-[calc(100vh-32px)] z-[70] w-full sm:w-[420px] bg-white sm:shadow-2xl sm:rounded-2xl overflow-hidden flex flex-col transition-transform duration-300 ease-out ${
          isCartOpen
            ? "translate-x-0"
            : "translate-x-full sm:translate-x-[calc(100%+16px)]"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="font-heading text-xl uppercase">
            MY <span className="text-brand-orange">CART</span>
          </h2>

          <button onClick={closeCart}>
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          {loading ? (
            <p className="text-center py-10">Loading...</p>
          ) : cartItems.length === 0 ? (
            <p className="text-center py-10">Cart is empty</p>
          ) : (
            cartItems.map((item) => {
              // ---------------- CUSTOM BOX ----------------
              if (item.isCustomBox) {
                return (
                  <div
                    key={`custom-${item._id}`}
                    className="py-5 border-b flex justify-between"
                  >
                    <div>
                      <h3 className="font-heading uppercase">
                        CUSTOM BOX ({item.packSize})
                      </h3>

                      <p className="text-sm text-gray-500">
                        {item.customProducts?.length || 0} items
                      </p>

                      <p className="font-heading mt-2">
                        ₹{item.customPrice}
                      </p>

                      <div className="flex gap-2 mt-3 flex-wrap">
                        {item.customProducts?.slice(0, 6).map((p) => (
                          <img
                            key={p._id}
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ))}
                      </div>
                    </div>

                    {/* TRASH BUTTON (CUSTOM BOX) */}
                    <button
                      onClick={() => removeCustomBox(item._id)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              }

              // ---------------- NORMAL PRODUCT ----------------
              const units = item.pack?.units || 1;
              const price = item.pack?.price || 0;

              return (
                <div
                  key={`${item._id}-${item.pack?.label || "default"}`}
                  className="py-5 border-b flex gap-4"
                >
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="w-20 h-20 rounded object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-heading uppercase">
                        {item.product?.name}
                      </h3>

                      {/* TRASH BUTTON (NORMAL PRODUCT) */}
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500">
                      {item.product?.weight || "100gm"}
                    </p>

                    <div className="flex justify-between mt-3">
                      <span className="font-heading">
                        ₹{price * item.quantity}
                      </span>

                      <div className="flex items-center border rounded-full">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id, item.quantity - 1
                            )
                          }
                        >
                          <Minus size={14} />
                        </button>

                        <span className="px-2">{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id, item.quantity + 1
                            )
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        {cartItems.length > 0 && (
          <div className="border-t px-6 py-5">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>

            {/* <div className="flex justify-between text-sm mt-2">
              <span>Shipping</span>
              <span>₹{SHIPPING_FEE}</span>
            </div> */}

            <button
              onClick={handleCheckout}
              className="w-full mt-4 bg-brand-orange text-white py-3 rounded-full"
            >
              PROCEED TO CHECKOUT ₹{grandTotal.toFixed(0)}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}