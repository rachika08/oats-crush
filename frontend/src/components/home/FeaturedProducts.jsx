import { useEffect, useState } from "react";
import api from "../../api/axios"; // adjust path
import ProductCard from "../ProductCard"; // adjust path if needed
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/product"); //'/product/featured'

      const allProducts = res.data.products || res.data;

      // show first 8 products
      setProducts(allProducts.slice(0, 8));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-8">
          Featured Products
        </h2>

        {products.length === 0 ? (
          <p className="text-center">
            No products available
          </p>
        ) : (
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            breakpoints={{
                320: {
                slidesPerView: 1,
                },
                640: {
                slidesPerView: 2,
                },
                1024: {
                slidesPerView: 4,
                },
            }}
            >
            {products.map((product) => (
                <SwiperSlide key={product._id}>
                <ProductCard product={product} />
                </SwiperSlide>
            ))}
            </Swiper>
        )}

      </div>
    </section>
  );
};

export default FeaturedProducts;