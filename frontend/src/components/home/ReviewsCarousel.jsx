import { useState } from "react";
import { Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

// Placeholder data — swap video/image/product fields with real content.
const reviews = [
  {
    id: 1,
    videoThumbnail: "/src/assets/images/coffee.png",
    productName: "RASMALAI OATS SHAKE",
    price: 120,
    productId: "",
  },
  {
    id: 2,
    videoThumbnail: "/src/assets/images/oat-milk.png",
    productName: "COFFEE OATS SHAKE",
    price: 120,
    productId: "",
  },
  {
    id: 3,
    videoThumbnail: "/src/assets/images/rasmalai.png",
    productName: "MIDNIGHT LATTE",
    price: 140,
    productId: "",
  },
];

const ReviewsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(Math.floor(reviews.length / 2));

  const activeReview = reviews[activeIndex];

  const handleAddToCart = () => {
    // TODO: wire to real cart endpoint once productId is available.
    console.log("Add to cart:", activeReview.productName);
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-[56px] mb-2">
          CRUSH-WORTHY REVIEWS
        </h2>

        <p className="font-body text-gray-600 text-sm sm:text-base mb-12">
          Watch what people have to say
        </p>

        <div className="relative max-w-3xl mx-auto">
          {/* Prev arrow */}
          <button
            className="reviews-prev hidden sm:flex absolute -left-2 sm:-left-6 md:-left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-brand-orange text-white items-center justify-center shadow-md hover:bg-black transition cursor-pointer"
            aria-label="Previous review"
          >
            ‹
          </button>

          {/* Next arrow */}
          <button
            className="reviews-next hidden sm:flex absolute -right-2 sm:-right-6 md:-right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-brand-orange text-white items-center justify-center shadow-md hover:bg-black transition cursor-pointer"
            aria-label="Next review"
          >
            ›
          </button>

          <Swiper
            modules={[EffectCoverflow, Navigation]}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
             initialSlide={Math.floor(reviews.length / 2)}
            navigation={{
              prevEl: ".reviews-prev",
              nextEl: ".reviews-next",
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 150,
              modifier: 1.5,
              slideShadows: false,
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="reviews-swiper !py-6"
          >
            {reviews.map((review, index) => {
              const isActive = index === activeIndex;

              return (
                <SwiperSlide
                  key={review.id}
                  className="!w-52 sm:!w-72 md:!w-[340px]"
                  style={{ zIndex: isActive ? 20 : 1 }}
                >
                  <div
                    className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-200"
                    style={{ aspectRatio: "9 / 11" }}
                  >
                    <img
                      src={review.videoThumbnail}
                      alt={review.productName}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Dim non-active slides */}
                    <div
                      className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
                        isActive ? "opacity-0" : "opacity-100"
                      }`}
                    />

                    {isActive && (
                      <button
                        aria-label="Play video"
                        className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                      >
                        <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black flex items-center justify-center group-hover:bg-brand-orange transition">
                          <Play
                            size={18}
                            className="text-white fill-white ml-0.5"
                          />
                        </span>
                      </button>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Active product info */}
        <div className="mt-8 max-w-xs sm:max-w-sm mx-auto text-left">
          <h3 className="font-heading text-lg uppercase mb-1">
            {activeReview.productName}
          </h3>

          <p className="font-body text-sm text-gray-700 mb-4">
            ₹{activeReview.price}.00
          </p>

          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white rounded-full py-3 font-body text-base font-medium hover:bg-brand-orange transition cursor-pointer"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsCarousel;