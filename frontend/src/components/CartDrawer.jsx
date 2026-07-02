import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, X } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";


const SHIPPING_FEE = 60;
const FREE_SHIPPING_THRESHOLD = 499;
const DISCOUNT_THRESHOLD = 1499;
const DISCOUNT_AMOUNT = 50;
const FREE_BLENDER_THRESHOLD = 2999;

const REWARD_TIERS = [
  { amount: FREE_SHIPPING_THRESHOLD, label: "Free Shipping" },
  { amount: DISCOUNT_THRESHOLD, label: "₹50 Off" },
  { amount: FREE_BLENDER_THRESHOLD, label: "Free Blender" },
];


export default function CartDrawer() {
  const { isCartOpen, closeCart } = useCart();

  // ---------------- EXPLORE MORE (real products, static UI) ----------------
  const [exploreProducts, setExploreProducts] = useState([]);
  

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
const handleExploreAddToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to add items to your cart");
        closeCart();
        navigate("/login");
        return;
      }

      const defaultPack =
        product.packSizes?.find((p) => Number(p.units) === 1) ||
        product.packSizes?.[0];

      if (!defaultPack) {
        alert("Product pack missing");
        return;
      }

      const price = Number(defaultPack.price);
      if (isNaN(price)) {
        alert("Invalid product price");
        return;
      }

      await api.post(
        "/cart/add",
        {
          productId: product._id,
          quantity: 1,
          pack: {
            label: defaultPack.label,
            units: Number(defaultPack.units) || 1,
            price: price,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchCart();
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Could not add item to cart");
    }
  };

  const fetchExploreProducts = async () => {
    try {
      const res = await api.get("/product");
      const allProducts = res.data.products || res.data;

      const cartProductIds = cartItems
        .filter((item) => !item.isCustomBox)
        .map((item) => item.product?._id);

      const filtered = allProducts
        .filter((p) => !cartProductIds.includes(p._id))
        .filter((p) => p.stock > 0)
        .slice(0, 6);

      setExploreProducts(filtered);
    } catch (error) {
      console.log("Explore products fetch error:", error);
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
    fetchExploreProducts();
  }, [isCartOpen, cartItems.length]);

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
    }

    return acc + (item.pack?.price || 0) * (item.quantity || 1);
  }, 0);

  const shippingFee =
    cartItems.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FEE;

  const discount = subtotal >= DISCOUNT_THRESHOLD ? DISCOUNT_AMOUNT : 0;

  const grandTotal = cartItems.length > 0 ? subtotal + shippingFee - discount : 0;

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
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-heading text-xl uppercase">
            MY <span className="text-brand-orange">CART</span>
          </h2>

          <button onClick={closeCart}>
            <X size={24} />
          </button>
        </div>

        {/* REWARD PROGRESS BAR */}
        {cartItems.length > 0 && (
          <div className="px-6 pt-4 pb-2 border-b border-gray-200">
            <p className="font-body text-xs text-gray-500 mb-3 text-center">
              {subtotal >= FREE_BLENDER_THRESHOLD
                ? "You've unlocked every reward! 🎉"
                : `Add ₹${(
                    REWARD_TIERS.find((t) => subtotal < t.amount)?.amount -
                    subtotal
                  ).toFixed(0)} more to unlock ${
                    REWARD_TIERS.find((t) => subtotal < t.amount)?.label
                  }`}
            </p>

            <div className="relative h-1.5 bg-gray-200 rounded-full mb-3">
              <div
                className="absolute top-0 left-0 h-1.5 bg-brand-orange rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (subtotal / FREE_BLENDER_THRESHOLD) * 100,
                    100
                  )}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-center">
              {REWARD_TIERS.map((tier) => {
                const unlocked = subtotal >= tier.amount;
                return (
                  <div key={tier.amount} className="flex flex-col items-center w-1/3">
                    <span
                      className={`text-[10px] font-semibold ${
                        unlocked ? "text-brand-orange" : "text-gray-400"
                      }`}
                    >
                      {unlocked ? "✓" : "₹" + tier.amount}
                    </span>
                    <span
                      className={`text-[10px] mt-0.5 ${
                        unlocked ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {tier.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          {loading ? (
            <p className="text-center py-10">Loading...</p>
          ) : cartItems.length === 0 ? (
    <div className="text-center py-16 flex flex-col items-center">
        <p className="font-heading text-xl mb-2 text-gray-800">YOUR CART IS EMPTY</p>
        <p className="font-body text-sm text-gray-500 mb-8">
            Add a flavour and crush your cravings.
        </p>
        <button
            onClick={() => { closeCart(); navigate("/products"); }}
            className="bg-brand-orange text-white font-heading text-sm px-8 py-3 rounded-full shadow hover:bg-orange-600 transition cursor-pointer"
        >
            SHOP NOW
        </button>
    </div>
) : (
            cartItems.map((item) => {
              // ---------------- CUSTOM BOX ----------------
              if (item.isCustomBox) {
                return (
                  <div
  key={`custom-${item._id}`}
  className="py-5 border-b border-gray-100 flex justify-between"
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
    className="py-5 border-b border-gray-100 last:border-0 flex gap-5"
>
                  <img
    src={item.product?.image}
    alt={item.product?.name}
    className="w-24 h-24 rounded-lg object-cover flex-shrink-0 bg-gray-50"
/>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <h3 className="font-heading text-base text-gray-900 uppercase leading-snug">
    {item.product?.name}
</h3>

<button
    onClick={() => removeItem(item._id)}
    aria-label="Remove item"
    className="text-black hover:text-red-500 transition cursor-pointer flex-shrink-0"
>
    <Trash2 size={16} />
</button>
                    </div>

                    <p className="font-body text-xs text-gray-500 mt-1">
    {item.product?.weight || "100gm"}
</p>

                    <div className="flex items-center justify-between mt-4">
    <span className="font-heading text-lg text-gray-900">
        ₹{(price * item.quantity).toFixed(2)}
    </span>

    <div className="flex items-center border border-brand-orange rounded-full bg-white">
                        <button
    onClick={() => updateQuantity(item._id, item.quantity - 1)}
    aria-label="Decrease quantity"
    className="w-8 h-8 flex items-center justify-center text-black hover:text-brand-orange cursor-pointer transition"
>
    <Minus size={14} />
</button>

<span className="font-body text-sm font-medium w-6 text-center text-black">
    {item.quantity}
</span>

<button
    onClick={() => updateQuantity(item._id, item.quantity + 1)}
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

          {/* EXPLORE MORE — real products */}
          {cartItems.length > 0 && exploreProducts.length > 0 && (
            <div className="py-5 border-t border-gray-200">
              <p className="font-body text-sm font-semibold mb-3">
                You might also like
              </p>
              <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {exploreProducts.map((p) => (
                                    <div
                    key={p._id}
                    className="flex-shrink-0 w-28 border border-gray-200 rounded-xl p-2"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-16 object-cover rounded-lg mb-2"
                    />
                    <p className="font-body text-[11px] leading-tight mb-1 line-clamp-2">
                      {p.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xs">
                        ₹{p.packSizes?.[0]?.price ?? p.price}
                      </span>
                      <button
                        onClick={() => handleExploreAddToCart(p)}
                        className="text-brand-orange border border-brand-orange rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none hover:bg-brand-orange hover:text-white transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
{cartItems.length > 0 && (
          <div className="border-t  border-brand-orange px-6 py-5">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>

            <div className="flex justify-between text-sm mt-2">
              <span>Shipping</span>
              <span className={shippingFee === 0 ? "text-green-600 font-medium" : ""}>
                {shippingFee === 0 ? "FREE" : `₹${SHIPPING_FEE}`}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-sm mt-2 text-green-600 font-medium">
                <span>Offer applied (₹1499+)</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-200 font-semibold">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(0)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-4 bg-brand-orange font-heading text-white py-3 rounded-full"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </aside>
    </>
  );
}