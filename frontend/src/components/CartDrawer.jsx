import { useEffect, useRef, useState } from "react";
import { fireConfetti } from "../utils/confetti";
import { useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, X, Plus as PlusIcon, BadgePercent } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { calculatePricing, REWARD_TIERS, FREE_BLENDER_THRESHOLD, SHIPPING_FEE } from "../utils/pricing";
import AddressModal from "./AddressModal";

const CHECKOUT_STEPS = [
  { key: "cart", label: "Cart" },
  { key: "shipping", label: "Shipping Details" },
  { key: "order", label: "Order Details" },
];

function CheckoutBreadcrumb({ step, onNavigate }) {
  const currentIndex = CHECKOUT_STEPS.findIndex((s) => s.key === step);

  return (
    <div className="px-6 sm:px-8 py-3 border-b border-gray-100 flex items-center gap-2 text-sm font-body flex-shrink-0">
      {CHECKOUT_STEPS.map((s, i) => (
        <span key={s.key} className="flex items-center gap-2">
          {i > 0 && <span className="text-gray-300">›</span>}
          <button
            type="button"
            onClick={() => i <= currentIndex && onNavigate(s.key)}
            className={
              i === currentIndex
                ? "font-semibold text-black cursor-default"
                : i < currentIndex
                ? "text-brand-orange hover:underline cursor-pointer"
                : "text-gray-400 cursor-default"
            }
          >
            {s.label}
          </button>
        </span>
      ))}
    </div>
  );
}

export default function CartDrawer() {
  const { isCartOpen, closeCart, checkoutStep, setCheckoutStep } = useCart();

  // ---------------- EXPLORE MORE (real products, static UI) ----------------
  const [exploreProducts, setExploreProducts] = useState([]);

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ---------------- SHIPPING / ADDRESSES ----------------
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // ---------------- ORDER / PAYMENT ----------------
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

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

  // ---------------- FETCH ADDRESSES ----------------
  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await api.get("/address");
      setAddresses(res.data);

      if (res.data.length > 0) {
        setSelectedAddress((prev) => prev || res.data[0]._id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAddresses(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCartOpen, cartItems.length]);

  useEffect(() => {
    if (!isCartOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeCart();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCartOpen, closeCart]);

  // fetch addresses the moment we enter the shipping step
  useEffect(() => {
    if (!isCartOpen || checkoutStep !== "shipping") return;
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCartOpen, checkoutStep]);

  // ---------------- QUANTITY UPDATE ----------------
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

  // ---------------- PRICING ----------------
  const subtotal = cartItems.reduce((acc, item) => {
    if (item.isCustomBox) return acc + (item.customPrice || 0);
    return acc + (item.pack?.price || 0) * (item.quantity || 1);
  }, 0);

  const { shippingFee, discount, grandTotal } = calculatePricing(subtotal, cartItems.length);
  const shippingSaved = shippingFee === 0 ? SHIPPING_FEE : 0;
  const totalSaved = shippingSaved + discount;
  const savedPercent = subtotal > 0 ? Math.round((totalSaved / subtotal) * 100) : 0;

const prevSubtotalRef = useRef(null);
const hasBaselineRef = useRef(false);

useEffect(() => {
  if (!isCartOpen) {
    hasBaselineRef.current = false;
    prevSubtotalRef.current = null;
  }
}, [isCartOpen]);

useEffect(() => {
  if (!isCartOpen || loading) return;

  if (!hasBaselineRef.current) {
    prevSubtotalRef.current = subtotal;
    hasBaselineRef.current = true;
    return;
  }

  const prev = prevSubtotalRef.current;
  REWARD_TIERS.forEach((tier) => {
    if (prev < tier.amount && subtotal >= tier.amount) {
      fireConfetti();
    }
  });
  prevSubtotalRef.current = subtotal;
}, [subtotal, loading, isCartOpen]);

const couponBadge = discount > 0 && (
  <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 my-4">
    <div className="flex items-center gap-2">
      <BadgePercent size={18} className="text-brand-orange" />
      <span className="font-body text-sm text-black">
        <span className="font-semibold">CRUSH50</span> applied
      </span>
    </div>
    <span className="bg-green-100 text-green-700 font-body text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
      Saved ₹{discount}.00
    </span>
  </div>
);

  // ---------------- STEP NAVIGATION ----------------
  const handleProceedToCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to proceed to checkout");
      closeCart();
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) return;
    setCheckoutStep("shipping");
  };

  const handleViewOrderDetails = () => {
    if (!selectedAddress) {
      alert("Please select or add a shipping address");
      return;
    }
    setCheckoutStep("order");
  };

  // ---------------- PLACE ORDER (RAZORPAY ONLY) ----------------
  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;

    if (!selectedAddress) {
      alert("Please select an address");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderRes = await api.post("/order", {
        addressId: selectedAddress,
        paymentMethod: "RAZORPAY",
      });

      const order = orderRes.data.order;

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

            closeCart();
            navigate(`/order/${order._id}`);
          } catch (error) {
            console.log("Verification failed", error);
          }
        },

        theme: { color:  "#F66F1E" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
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

        {/* BREADCRUMB — only once past the cart step */}
        {checkoutStep !== "cart" && (
          <CheckoutBreadcrumb step={checkoutStep} onNavigate={setCheckoutStep} />
        )}

        {/* REWARD PROGRESS BAR — cart step only */}
        {checkoutStep === "cart" && cartItems.length > 0 && (
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
          {/* ---------------- CART STEP ---------------- */}
          {checkoutStep === "cart" && (
            <>
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
{couponBadge}
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
            </>
          )}

          {/* ---------------- SHIPPING STEP ---------------- */}
          {checkoutStep === "shipping" && (
            <div className="py-4">
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="flex items-center gap-1 text-brand-orange font-body text-sm font-semibold mb-5 cursor-pointer hover:underline"
              >
                <PlusIcon size={16} /> Add New Address
              </button>

              {loadingAddresses ? (
                <p className="text-center py-10 text-gray-500 font-body text-sm">
                  Loading addresses...
                </p>
              ) : addresses.length === 0 ? (
                <p className="text-center py-10 text-gray-500 font-body text-sm">
                  No saved addresses yet. Add one to continue.
                </p>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <button
                      key={address._id}
                      onClick={() => setSelectedAddress(address._id)}
                      className={`w-full text-left border-2 rounded-2xl p-4 transition cursor-pointer ${
                        selectedAddress === address._id
                          ? "border-brand-orange"
                          : "border-gray-200"
                      }`}
                    >
                      <p className="font-body font-semibold text-sm uppercase mb-1">
                        {address.label}
                      </p>
                      <p className="font-body text-sm text-gray-700">
                        {address.fullName}
                      </p>
                      <p className="font-body text-sm text-gray-500">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                      </p>
                      <p className="font-body text-sm text-gray-500">
                        {address.city}, {address.state}
                      </p>
                      <p className="font-body text-sm text-gray-500">{address.pincode}</p>
                      <p className="font-body text-sm text-gray-500">{address.phone}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---------------- ORDER DETAILS STEP ---------------- */}
          {checkoutStep === "order" && (
            <div className="py-4">
              <p className="font-heading text-lg uppercase mb-4">Order Summary</p>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) =>
                  item.isCustomBox ? (
                    <div
                      key={`custom-${item._id}`}
                      className="flex justify-between items-center gap-4 border-b border-gray-100 pb-4"
                    >
                      <div>
                        <p className="font-body text-sm font-semibold">
                          Custom Box ({item.packSize})
                        </p>
                        <p className="font-body text-xs text-gray-500">Quantity: 1</p>
                      </div>
                      <span className="font-body text-sm flex-shrink-0">
                        ₹{item.customPrice}
                      </span>
                    </div>
                  ) : (
                    <div
                      key={item._id}
                      className="flex justify-between items-center gap-4 border-b border-gray-100 pb-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.product?.image}
                          alt={item.product?.name}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-gray-50"
                        />
                        <div className="min-w-0">
                          <p className="font-body text-l font-semibold truncate">
                            {item.product?.name}
                          </p>
                          <p className="font-body text-xs text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-body font-semibold text-sm flex-shrink-0">
                        ₹{((item.pack?.price || 0) * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  )
                )}
              </div>
{couponBadge}
              <div className="space-y-2 font-body text-sm">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? "text-green-600 font-medium" : ""}>
                    {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Offer applied</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-body font-semibold text-base pt-2 border-t border-gray-200">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toFixed(0)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
{cartItems.length > 0 && (
  <div className="relative border-t border-brand-orange px-6 py-5">

{checkoutStep !== "order" && totalSaved > 0 && (
  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[11px] font-heading px-3 py-1 rounded-full shadow-md whitespace-nowrap">
    YOU SAVED {savedPercent}%
  </span>
)}
            {/* totals — shown on cart & shipping, hidden on order (already shown above) */}
            {checkoutStep !== "order" && (
              <>
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>

                <div className="flex justify-between text-sm mt-2">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? "text-green-600 font-medium" : ""}>
                    {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
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
              </>
            )}

            {checkoutStep === "cart" && (
              <button
                onClick={handleProceedToCheckout}
                className="w-full mt-4 bg-brand-orange font-heading text-white py-3 rounded-full"
              >
                PROCEED TO CHECKOUT
              </button>
            )}

            {checkoutStep === "shipping" && (
              <button
                onClick={handleViewOrderDetails}
                className="w-full mt-4 bg-brand-orange font-heading text-white py-3 rounded-full"
              >
                VIEW ORDER DETAILS
              </button>
            )}

            {checkoutStep === "order" && (
              <>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full bg-brand-orange font-heading text-white py-3 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? "PROCESSING..." : "PAY NOW"}
                </button>
                <p className="text-center font-body text-xs text-gray-500 mt-2">
                  *You will be redirected to Razorpay to complete your payment
                </p>
              </>
            )}
          </div>
        )}
      </aside>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
        initialData={null}
      />
    </>
  );
}