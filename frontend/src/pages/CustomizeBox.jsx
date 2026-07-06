import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import { useCart } from "../context/CartContext";

import "swiper/css";
import "swiper/css/navigation";

const PACK_CONFIG = {
  20: { price: 2500 },
  30: { price: 3000 },
};

export default function CustomizeBox() {
  const [packSize, setPackSize] = useState(20);
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // [{ uid, product }]
  const [loading, setLoading] = useState(true);
  const uidRef = useRef(0);
  const navigate = useNavigate();
  const { openCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/product");
      setProducts(res.data.products || res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const switchPackSize = (size) => {
    if (size === packSize) return;
    if (selectedItems.length > 0) {
      const confirmSwitch = window.confirm(
        "Switching pack size will clear your current selection. Continue?"
      );
      if (!confirmSwitch) return;
    }
    setPackSize(size);
    setSelectedItems([]);
  };

  const addItem = (product) => {
  if (selectedItems.length >= packSize) return;
  if (product.stock <= 0) return;
  uidRef.current += 1;
  setSelectedItems((prev) => [...prev, { uid: uidRef.current, product }]);
};

  const removeItem = (uid) => {
    setSelectedItems((prev) => prev.filter((item) => item.uid !== uid));
  };

  const countFor = (productId) =>
    selectedItems.filter((item) => item.product._id === productId).length;

  const isComplete = selectedItems.length === packSize;
  const remaining = packSize - selectedItems.length;
  const emptySlots = Math.max(packSize - selectedItems.length, 0);

const [addingBox, setAddingBox] = useState(false);

const handleAddBoxToCart = async () => {
    if (!isComplete || addingBox) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add your box to cart");
      navigate("/login");
      return;
    }

    const payload = {
      packSize,
      items: selectedItems.map(item => item.product._id),
    };

    setAddingBox(true);
    try {
        await api.post("/cart/add-custom-box", payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedItems([]);
        openCart();
    } catch (error) {
        alert(error?.response?.data?.message || "Could not add box to cart. Please try again.");
    } finally {
        setAddingBox(false);
    }
};

  return (
    <>
      <Navbar />

      <section className="pt-40 sm:pt-48 px-4 sm:px-6 text-center">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-black mb-8">
          CUSTOMIZE YOUR OWN BOX
        </h1>

        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            onClick={() => switchPackSize(20)}
            className={`font-heading text-base px-8 py-2.5 rounded-full border-2 transition cursor-pointer ${
              packSize === 20
                ? "bg-brand-orange text-white border-brand-orange shadow-md"
                : "bg-white text-brand-orange border-brand-orange hover:bg-brand-orange/5"
            }`}
          >
            PACK OF 20
          </button>
          <button
            onClick={() => switchPackSize(30)}
            className={`font-heading text-base px-8 py-2.5 rounded-full border-2 transition cursor-pointer ${
              packSize === 30
                ? "bg-brand-orange text-white border-brand-orange shadow-md"
                : "bg-white text-brand-orange border-brand-orange hover:bg-brand-orange/5"
            }`}
          >
            PACK OF 30
          </button>
        </div>
      </section>

      <div className="bg-brand-orange/10 py-3 px-4 text-center mb-10">
        <p className="font-body text-sm sm:text-base text-black">
          Select any {packSize} at only ₹{PACK_CONFIG[packSize].price}
        </p>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        {loading ? (
          <p className="text-center font-body text-gray-500 py-10">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <p className="text-center font-body text-gray-500 py-10">
            No products available
          </p>
        ) : (
          <div className="relative mb-10">
            <button
              className="customize-prev hidden sm:flex absolute -left-5 top-[38%] z-10 w-12 h-12 rounded-full bg-brand-orange text-white items-center justify-center shadow-md hover:-translate-x-1 text-4xl transition cursor-pointer"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              className="customize-next hidden sm:flex absolute -right-5 top-[38%] z-10 w-12 h-12 rounded-full bg-brand-orange text-white items-center justify-center text-4xl shadow-md hover:translate-x-1 transition cursor-pointer"
              aria-label="Next"
            >
              ›
            </button>

            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: ".customize-prev",
                nextEl: ".customize-next",
              }}
              spaceBetween={20}
              className="!pb-2"
              breakpoints={{
                320: { slidesPerView: 1.4 },
                640: { slidesPerView: 2.2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {products.map((product) => {
  const count = countFor(product._id);
  const isSoldOut = product.stock <= 0;

  return (
    <SwiperSlide key={product._id}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative aspect-square">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {isSoldOut && (
            <span className="absolute top-3 left-3 bg-white text-black text-xs font-body font-medium px-3 py-1 rounded-full">
              Sold Out
            </span>
          )}
          {count > 0 && !isSoldOut && (
            <span className="absolute top-3 right-3 bg-brand-orange text-white text-xs font-heading w-6 h-6 rounded-full flex items-center justify-center shadow-md">
              {count}
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-heading text-lg uppercase mb-1">{product.name}</h3>
          <p className="font-body text-sm text-gray-500 mb-4">
            {product.benefits?.slice(0, 2).join(" • ") || "Lactose-free • Vegan friendly"}
          </p>
          <button
            onClick={() => addItem(product)}
            disabled={isComplete || isSoldOut}
            className={`w-full rounded-full py-2.5 font-heading text-base font-medium transition border-2 ${
              isComplete || isSoldOut
                ? "bg-gray-200 text-gray-400 border-transparent cursor-not-allowed"
                : "bg-brand-orange text-white border-transparent hover:bg-white hover:text-brand-orange hover:border-brand-orange hover:-translate-y-1 shadow-md cursor-pointer"
            }`}
          >
            {isSoldOut ? "SOLD OUT" : isComplete ? "BOX FULL" : "ADD TO CART"}
          </button>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}

        {/* Selection tracker bar */}
        <div className="bg-white border border-gray-200 rounded-full shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto flex-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {selectedItems.map((item) => (
              <div key={item.uid} className="relative flex-shrink-0 group">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-brand-orange"
                />
                <button
                  onClick={() => removeItem(item.uid)}
                  aria-label={`Remove ${item.product.name}`}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {Array.from({ length: emptySlots }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-400 flex-shrink-0"
              >
                +
              </div>
            ))}
          </div>
<button
    onClick={handleAddBoxToCart}
    disabled={!isComplete || addingBox}
    className={`flex-shrink-0 font-heading text-sm sm:text-base px-6 py-2.5 rounded-full border-2 whitespace-nowrap transition ${
      isComplete
        ? "bg-brand-orange text-white border-brand-orange hover:-translate-y-1 shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        : "bg-white text-gray-400 border-gray-200 cursor-not-allowed"
    }`}
  >
    {addingBox
      ? "ADDING..."
      : isComplete
      ? `ADD BOX TO CART · ₹${PACK_CONFIG[packSize].price}`
      : `ADD ${remaining} MORE ITEM${remaining === 1 ? "" : "S"}`}
  </button>
        </div>
      </section>

      <Footer />
    </>
  );
}