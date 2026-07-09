import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Bell } from "lucide-react";
import { useCart } from "../../context/CartContext";
import CartToast from "../CartToast";
import { Reveal } from "../Reveal";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getStrikethroughPrice } from "../../utils/pricing";


const FeaturedProducts = ({
  excludeProductId,
  heading = "CRUSH YOUR CRAVINGS",
  subheading = "Pick your flavour. Same protein punch, different vibe.",
  showSquiggle = true,
}) => {
  const [products, setProducts] = useState([]);
const [toast, setToast] = useState({ show: false, message: "", variant: "success" });
  const [notifyStatus, setNotifyStatus] = useState({});
  const navigate = useNavigate();
  const { openCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res=await api.get("/product");
      const allProducts = res.data.products || res.data;

    const filteredProducts = allProducts.filter(
      (product) => product._id !== excludeProductId
    );

    setProducts(filteredProducts);
    } catch (error) {
      console.log(error);
    }
  };

  // const handleAddToCart = async (e, product) => {
  //   e.stopPropagation();

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       alert("Please login to add items to your cart");
  //       navigate("/login");
  //       return;
  //     }

  //     await api.post(
  //       "/cart/add",
  //       { productId: product._id, quantity: 1 },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     alert("Added to cart!");
  //   } catch (error) {
  //     console.log(error.response?.data || error.message);
  //   }
  // };
const [cartStatus, setCartStatus] = useState({});

const handleAddToCart = async (e, product) => {
  e.stopPropagation();

  if (cartStatus[product._id] === "loading") return;

  try {
    const token = localStorage.getItem("token");

if (!token) {
      setToast({ show: true, message: "Please login to add items to your cart", variant: "info" });
      setTimeout(() => navigate("/login"), 800);
      return;
    }

    const defaultPack =
      product.packSizes?.find((p) => Number(p.units) === 1) ||
      product.packSizes?.[0];

    if (!defaultPack) {
      setToast({ show: true, message: "Product pack missing", variant: "info" });
      return;
    }

    const price = Number(defaultPack.price);

    if (isNaN(price)) {
      setToast({ show: true, message: "Invalid product price", variant: "info" });
      return;
    }

    setCartStatus((prev) => ({ ...prev, [product._id]: "loading" }));

    const res = await api.post(
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

    const updatedItems = res.data.items || [];
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    localStorage.setItem("cartCount", updatedItems.length);
    window.dispatchEvent(new Event("cartUpdated"));

setCartStatus((prev) => ({ ...prev, [product._id]: "success" }));
    setToast({ show: true, message: "Added to cart successfully!", variant: "success" });

    setTimeout(() => {
      setCartStatus((prev) => ({ ...prev, [product._id]: "idle" }));
    }, 2000);
  } catch (error) {
    console.log(error.response?.data || error.message);
    setCartStatus((prev) => ({ ...prev, [product._id]: "idle" }));
  }
};

  const handleNotify = async (e, product) => {
    e.stopPropagation();

    const productId = product._id;

    if (notifyStatus[productId] === "loading" || notifyStatus[productId] === "success") {
      return;
    }

    const token = localStorage.getItem("token");

if (!token) {
      setToast({ show: true, message: "Please login to get notified", variant: "info" });
      setTimeout(() => navigate("/login"), 800);
      return;
    }

    setNotifyStatus((prev) => ({ ...prev, [productId]: "loading" }));

    try {
      await api.post(
        "/notification/notify",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifyStatus((prev) => ({ ...prev, [productId]: "success" }));
    } catch (error) {
      console.log(error.response?.data || error.message);

      if (error.response?.data?.message === "Already subscribed") {
        setNotifyStatus((prev) => ({ ...prev, [productId]: "success" }));
        return;
      }

setNotifyStatus((prev) => ({ ...prev, [productId]: "idle" }));
      setToast({ show: true, message: error.response?.data?.message || "Something went wrong", variant: "info" });
    }
  };


  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative flex items-end justify-between mb-8 sm:mb-10">
          <Reveal variant="subtle">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-[56px] mb-2">
              {heading}
            </h2>
            <p className="font-body text-gray-600 text-sm sm:text-base">
              {subheading}
            </p>
          </div>
          </Reveal>
{showSquiggle && (
  <img
    src="/images/arrow-s.svg"
    alt=""
    className="hidden sm:block absolute left-[45%] mt-1 w-30 h-14  pointer-events-none"
  />
)}
          <button
            onClick={() => navigate("/products")}
            className="hidden sm:flex items-center gap-2 border border-brand-orange text-brand-orange rounded-full px-5 py-2 font-heading text-lg font-medium shadow-md hover:bg-brand-orange hover:-translate-y-1 hover:text-white transition flex-shrink-0 cursor-pointer"
          >
            VIEW ALL PRODUCTS
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {products.length === 0 ? (
          <p className="text-center font-body text-gray-500">
            No products available
          </p>
        ) : (
          <div className="relative">
            {/* Custom nav arrows, large circular orange, overlapping the row */}
            <button
              className="cravings-prev hidden sm:flex absolute -left-5 top-[38%] z-10 w-12 h-12 rounded-full bg-brand-orange text-white items-center justify-center shadow-md hover:-translate-x-1 text-white text-4xl transition cursor-pointer"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              className="cravings-next hidden sm:flex absolute -right-5 top-[38%] z-10 w-12 h-12 rounded-full bg-brand-orange text-white items-center justify-center text-white text-4xl shadow-md hover:-translate-x-1 transition cursor-pointer"
              aria-label="Next"
            >
              ›
            </button>

            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{
                prevEl: ".cravings-prev",
                nextEl: ".cravings-next",
              }}
              pagination={{ clickable: true }}
              spaceBetween={20}
              className="cravings-swiper !pb-10 sm:!pb-0"
              breakpoints={{
                320: { slidesPerView: 1.1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
{products.map((product, index) => {
                const isComingSoon = product.isLaunched === false;
                const isSoldOut = !isComingSoon && product.stock <= 0;
                const isUnavailable = isComingSoon || isSoldOut;
                const status = notifyStatus[product._id];

                return (
                  <SwiperSlide key={product._id}>
                    <Reveal variant="subtle">
                    <div
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer transition shadow-md hover:-translate-y-1"
                    >
<div className="relative aspect-square m-3 rounded-xl overflow-hidden">
                        {isComingSoon && (
                          <span className="absolute top-3 left-3 bg-white text-brand-orange-dark text-xs font-body font-medium px-3 py-1 rounded-full">
                            Coming Soon
                          </span>
                        )}
                        {isSoldOut && (
                          <span className="absolute top-3 left-3 bg-white text-black text-xs font-body font-medium px-3 py-1 rounded-full">
                            Sold Out
                          </span>
                        )}

                        {/* Sold-out products keep full-color imagery; only the CTA below is muted */}
                        <img
                          src={product.image}
                          loading="lazy"
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="px-4 pb-4">
                        <h3 className="font-heading text-2xl sm:text-2xl mb-1 uppercase">
                          {product.name}
                        </h3>

                        <p className="font-body text-sm text-gray-500 mb-3">
                          {product.benefits?.slice(0, 2).join(" • ") ||
                            product.category?.name}
                        </p>

                        {(() => {
                          const price = product.packSizes?.find(p => p.units === 1)?.price;
                          const strike = getStrikethroughPrice(product, price);

                          return (
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <p className="font-heading text-2xl">
                                ₹{price ?? "N/A"}
                              </p>
                              {strike && (
                                <>
                                  <span className="font-heading text-2xl text-gray-400 line-through">
                                    ₹{strike.original}
                                  </span>
                                  <span className="bg-green-100 text-green-700 text-xs font-body font-semibold px-2 py-0.5 rounded-full">
                                    {strike.discountPercent}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                          );
                        })()}

<button
  onClick={(e) =>
    isUnavailable ? handleNotify(e, product) : handleAddToCart(e, product)
  }
  disabled={
    isUnavailable
      ? status === "loading" || status === "success"
      : cartStatus[product._id] === "loading"
  }
  className={`w-full rounded-full py-2.5 font-heading text-lg font-medium transition flex items-center justify-center gap-2 border-2 ${
    isUnavailable
      ? "bg-gray-500 text-white cursor-pointer disabled:cursor-default"
      : "bg-brand-orange text-white border-transparent hover:border-brand-orange hover:bg-white hover:text-brand-orange hover:-translate-y-1 shadow-md cursor-pointer disabled:cursor-default disabled:opacity-60"
  }`}
>
  {isUnavailable ? (
    status === "success" ? (
      "SUBSCRIBED ✓"
    ) : status === "loading" ? (
      "SENDING..."
    ) : (
      <>NOTIFY <Bell size={14} /></>
    )
  ) : cartStatus[product._id] === "success" ? (
    "ADDED ✓"
  ) : cartStatus[product._id] === "loading" ? (
    "ADDING..."
  ) : (
    "ADD TO CART"
  )}
</button>
                      </div>
                    </div>
                     </Reveal>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
      </div>
      <CartToast
  show={toast.show}
  onClose={() => setToast((prev) => ({ ...prev, show: false }))}
  message={toast.message}
  variant={toast.variant}
/>
    </section>
  );
};

export default FeaturedProducts;