import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, X } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const SHIPPING_FEE = 99;

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useCart();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!isCartOpen) return;
    fetchCart();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCartOpen]);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCartOpen, closeCart]);

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;

    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQty }
          : item
      );
      localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
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

  const removeItem = async (productId) => {
    const updated = cartItems.filter(
      (item) => item.product._id !== productId
    );

    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    localStorage.setItem("cartCount", updated.length);
    window.dispatchEvent(new Event("cartUpdated"));

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

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.pack?.price || 0) * item.quantity,
    0
  );
  const grandTotal = cartItems.length > 0 ? subtotal + SHIPPING_FEE : 0;

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 right-0 h-full sm:top-4 sm:right-4 sm:h-[calc(100vh-32px)] z-[70] w-full sm:w-[420px] bg-white sm:shadow-2xl sm:rounded-2xl overflow-hidden flex flex-col transition-transform duration-300 ease-out ${
  isCartOpen ? "translate-x-0" : "translate-x-full sm:translate-x-[calc(100%+16px)]"
}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-heading text-xl sm:text-2xl tracking-wide uppercase text-gray-900">
            MY <span className="text-brand-orange">CART</span>
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-black hover:text-brand-orange transition cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-2 space-y-2">
          {loading && cartItems.length === 0 ? (
            <p className="font-body text-sm text-gray-400 text-center py-10">
              Loading your cart...
            </p>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center">
              <p className="font-heading text-xl mb-2 text-gray-800">YOUR CART IS EMPTY</p>
              <p className="font-body text-sm text-gray-500 mb-8">
                Add a flavour and crush your cravings.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  navigate("/products");
                }}
                className="bg-brand-orange text-white font-heading text-sm px-8 py-3 rounded-full shadow hover:bg-orange-600 transition cursor-pointer"
              >
                SHOP NOW
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const units = item.pack?.units || 1;
              const price = item.pack?.price || 0;

              return (
                <div
                  key={`${item.product._id}-${item.pack?.label}`}
                  className="py-5 border-b border-gray-100 last:border-0 flex gap-5"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0 bg-gray-50"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading text-base text-gray-900 uppercase leading-snug">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.product._id)}
                          aria-label="Remove item"
                          className="text-black hover:text-red-500 transition cursor-pointer flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="font-body text-xs text-gray-500 mt-1">
                        {item.product.weight || "100gm"}
                        {units > 1 ? ` x ${units}` : ""}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="font-heading text-lg text-gray-900">
                        ₹{(price * item.quantity).toFixed(2)}
                      </span>

                      {/* Brand orange border for the pill */}
                      <div className="flex items-center border border-brand-orange rounded-full bg-white">
                        <button
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="w-8 h-8 flex items-center justify-center text-black hover:text-brand-orange cursor-pointer transition"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-body text-sm font-medium w-6 text-center text-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="w-8 h-8 flex items-center justify-center text-black hover:text-brand-orange cursor-pointer transition"
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

        {cartItems.length > 0 && (
          <div className="flex-shrink-0 bg-white border-t border-gray-100 px-6 sm:px-8 py-6">
            <div className="space-y-3 font-body text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">₹{SHIPPING_FEE}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-brand-orange text-white flex justify-between items-center px-1 font-heading text-base py-1.5 rounded-full shadow-lg hover:bg-orange-600 transition cursor-pointer"
            >
              {/* Added layout structure to separate text and price with a vertical divider */}
              <span className="flex-1 text-center py-2.5 ml-4 tracking-wide">
                PROCEED TO CHECKOUT
              </span>
              
              <div className="h-6 w-[1px] bg-white/40"></div>
              
              <span className="w-1/3 text-center py-2.5 tracking-wide">
                ₹{grandTotal.toFixed(0)}
              </span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}