import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Bell } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/product/featured");

      const allProducts = res.data.products || res.data;
      setProducts(allProducts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add items to your cart");
        navigate("/login");
        return;
      }

      await api.post(
        "/cart/add",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Added to cart!");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-[56px] mb-2">
              CRUSH YOUR CRAVINGS
            </h2>
            <p className="font-body text-gray-600 text-sm sm:text-base">
              Pick your flavour. Same protein punch, different vibe.
            </p>
          </div>

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
              className="cravings-prev hidden sm:flex absolute -left-5 top-[38%] z-10 w-12 h-12 rounded-full bg-brand-orange text-white items-center justify-center shadow-md hover:bg-black transition cursor-pointer"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              className="cravings-next hidden sm:flex absolute -right-5 top-[38%] z-10 w-12 h-12 rounded-full bg-brand-orange text-white items-center justify-center shadow-md hover:bg-black transition cursor-pointer"
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
              {products.map((product) => {
                const isSoldOut = product.stock <= 0;

                return (
                  <SwiperSlide key={product._id}>
                    <div
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer transition shadow-md hover:-translate-y-1"
                    >
                      <div className="relative aspect-square m-3 rounded-xl overflow-hidden">
                        {isSoldOut && (
                          <span className="absolute top-3 left-3 bg-white text-black text-xs font-body font-medium px-3 py-1 rounded-full">
                            Sold Out
                          </span>
                        )}

                        {/* Sold-out products keep full-color imagery; only the CTA below is muted */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="px-4 pb-4">
                        <h3 className="font-heading text-xl sm:text-2xl mb-1 uppercase">
                          {product.name}
                        </h3>

                        <p className="font-body text-sm text-gray-500 mb-3">
                          {product.benefits?.slice(0, 2).join(" • ") ||
                            product.category?.name}
                        </p>

                        <p className="font-heading mb-3">
                          ₹{product.price}.00
                        </p>

                        <button
                          onClick={(e) =>
                            isSoldOut
                              ? e.stopPropagation()
                              : handleAddToCart(e, product)
                          }
                          disabled={isSoldOut}
                          className={`w-full rounded-full py-2.5 font-heading text-lg font-medium transition flex items-center justify-center gap-2 border-2 ${
                            isSoldOut
                              ? "bg-gray-500 text-white cursor-not-allowed"
                              : "bg-brand-orange text-white border-transparent hover:border-brand-orange hover:bg-white hover:text-brand-orange hover:-translate-y-1 shadow-md cursor-pointer"
                          }`}
                        >
                          {isSoldOut ? (
                            <>
                              NOTIFY WHEN BACK <Bell size={14} />
                            </>
                          ) : (
                            "ADD TO CART"
                          )}
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;