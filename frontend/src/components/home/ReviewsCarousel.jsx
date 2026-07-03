import { useState, useRef, useEffect, useCallback } from "react";
import { Play, X, Volume2, VolumeX, Heart, Share2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";

const reviews = [
  {
    id: 1,
    videoThumbnail: "/images/coffee.png",
    productName: "RASMALAI OATS SHAKE",
    price: 149,
    productId: "",
    videoUrl: "https://res.cloudinary.com/dg9uyzo0b/video/upload/v1782654214/WhatsApp_Video_2026-06-28_at_7.11.05_PM_jwwjqd.mp4",
  },
  {
    id: 2,
    videoThumbnail: "/images/oat-milk.png",
    productName: "COFFEE OATS SHAKE",
    price: 149,
    productId: "",
    videoUrl: "https://res.cloudinary.com/dg9uyzo0b/video/upload/v1782654214/WhatsApp_Video_2026-06-28_at_7.11.05_PM_jwwjqd.mp4",
  },
  {
    id: 3,
    videoThumbnail: "/images/rasmalai.png",
    productName: "MIDNIGHT LATTE",
    price: 200,
    productId: "",
    videoUrl: "https://res.cloudinary.com/dg9uyzo0b/video/upload/v1782654214/WhatsApp_Video_2026-06-28_at_7.11.05_PM_jwwjqd.mp4",
  },
  {
    id: 4,
    videoThumbnail: "/images/rasmalai.png",
    productName: "MIDNIGHT LATTE",
    price: 200,
    productId: "",
    videoUrl: "https://res.cloudinary.com/dg9uyzo0b/video/upload/v1782654214/WhatsApp_Video_2026-06-28_at_7.11.05_PM_jwwjqd.mp4",
  },
  {
    id: 5,
    videoThumbnail: "/images/rasmalai.png",
    productName: "MIDNIGHT LATTE",
    price: 200,
    productId: "",
    videoUrl: "https://res.cloudinary.com/dg9uyzo0b/video/upload/v1782654214/WhatsApp_Video_2026-06-28_at_7.11.05_PM_jwwjqd.mp4",
  },
];
// const handleAddToCart = async (e, product) => {
//   e.stopPropagation();

//   try {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("Please login to add items to your cart");
//       navigate("/login");
//       return;
//     }

//     const defaultPack =
//       product.packSizes?.find((p) => Number(p.units) === 1) ||
//       product.packSizes?.[0];

//     if (!defaultPack) {
//       alert("Product pack missing");
//       return;
//     }

//     const price = Number(defaultPack.price);

//     if (isNaN(price)) {
//       alert("Invalid product price");
//       return;
//     }

//     await api.post(
//       "/cart/add",
//       {
//         productId: product._id,
//         quantity: 1,
//         pack: {
//           label: defaultPack.label,
//           units: Number(defaultPack.units) || 1,
//           price: price, // ✅ ALWAYS NUMBER
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     alert("Added to cart!");
//   } catch (error) {
//     console.log(error.response?.data || error.message);
//   }
// };
const ReelModal = ({ review, onClose }) => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(false); // start as false — we won't autoplay
  const [isPlaying, setIsPlaying] = useState(false); // start as false
  const [liked, setLiked] = useState(false);
  const [likeCount] = useState(Math.floor(Math.random() * 900 + 100));
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const lastTap = useRef(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Reset on video change — but DON'T autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1;
    setMuted(false);
    setIsPlaying(false);
    setProgress(0);
  }, [review.videoUrl]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  }, []);

  // The key: user clicks play → start with sound, no muting needed
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = false;
      video.volume = 1;
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    video.volume = video.muted ? 0 : 1;
    setMuted(video.muted);
  }, []);

  const handleLike = useCallback((e) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
  }, []);

  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setLiked(true);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 900);
    } else {
      togglePlay();
    }
    lastTap.current = now;
  }, [togglePlay]);

  const handleShare = useCallback((e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: review.productName, text: `Check out ${review.productName}!` });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  }, [review.productName]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={handleBackdropClick}
    >
      <div className="relative flex items-end" style={{ height: "min(92vh, 600px)", aspectRatio: "9/16" }}>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 left-3 z-30 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/70 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* No autoPlay, no muted prop */}
        <video
          ref={videoRef}
          key={review.id}
          src={review.videoUrl}
          poster={review.videoThumbnail}
          playsInline
          loop
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover rounded-2xl z-0"
          onClick={handleDoubleTap}
          onTimeUpdate={handleTimeUpdate}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />

        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart size={80} className="text-white fill-white animate-ping" style={{ animationDuration: "0.6s" }} />
          </div>
        )}

        {/* Always show play button when not playing */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-10" onClick={togglePlay}>
            <span className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center cursor-pointer">
              <Play size={24} className="text-white fill-white ml-1" />
            </span>
          </div>
        )}

        <div className="absolute right-3 bottom-20 z-30 flex flex-col items-center gap-5">
          <button onClick={handleLike} aria-label="Like" className="flex flex-col items-center gap-1 cursor-pointer group">
            <Heart size={28} className={`transition-transform group-active:scale-125 ${liked ? "fill-red-500 text-red-500" : "text-white"}`} />
            <span className="text-white text-xs font-medium">{likeCount + (liked ? 1 : 0)}</span>
          </button>

          <button onClick={handleShare} aria-label="Share" className="flex flex-col items-center gap-1 cursor-pointer">
            <Share2 size={26} className="text-white" />
            <span className="text-white text-xs font-medium">Share</span>
          </button>

          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="flex flex-col items-center gap-1 cursor-pointer p-2 bg-black/20 rounded-full hover:bg-black/40 transition"
          >
            {muted ? <VolumeX size={26} className="text-white" /> : <Volume2 size={26} className="text-white" />}
          </button>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 z-30 rounded-b-2xl px-4 pb-4 pt-12"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}
        >
          <p className="text-white/70 text-xs mb-0.5 font-body">Featured product</p>
          <h3 className="text-white font-heading text-base uppercase mb-0.5">{review.productName}</h3>
          <p className="text-white/80 font-body text-sm mb-3">₹{review.price}.00</p>
          <button
            onClick={(e) => { e.stopPropagation(); console.log("Add to cart:", review.productName); }}
            className="w-full bg-white text-black rounded-full py-2.5 font-heading text-sm font-semibold hover:bg-brand-orange hover:text-white transition cursor-pointer"
          >
            ADD TO CART
          </button>
        </div>

        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-t-2xl z-30 overflow-hidden">
          <div className="h-full bg-white transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

// ─── Main Carousel ────────────────────────────────────────────────────────────
const ReviewsCarousel = () => {
  const [openReview, setOpenReview] = useState(null);

  return (
    <>
      {openReview && (
        <ReelModal
          key={openReview.id}
          review={openReview}
          onClose={() => setOpenReview(null)}
        />
      )}

      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-[56px] mb-2">
            CRUSH-WORTHY REVIEWS
          </h2>
          <p className="font-body text-gray-600 text-sm sm:text-base mb-12">
            Watch what people have to say
          </p>

          <div className="relative">
            <button className="reviews-prev hidden sm:flex absolute -left-2 sm:-left-4 md:-left-6 ..." aria-label="Previous">‹</button>
            <button className="reviews-next hidden sm:flex absolute -right-2 sm:-right-4 md:-right-6 ..." aria-label="Next">›</button>

            <Swiper
              modules={[Navigation]}
              navigation={{ prevEl: ".reviews-prev", nextEl: ".reviews-next" }}
              spaceBetween={16}
              slidesPerView={1.6}
              breakpoints={{
                640: { slidesPerView: 2.2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 28 },
              }}
              className="reviews-swiper !py-4"
            >
              {reviews.map((review) => (
                <SwiperSlide key={review.id}>
                  <div className="text-left">
                    <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-200" style={{ aspectRatio: "9 / 11" }}>
                      <img src={review.videoThumbnail} alt={review.productName} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40" />
                      <button
                        aria-label="Play reel"
                        onClick={() => setOpenReview(review)}
                        className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                      >
                        <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black flex items-center justify-center group-hover:bg-brand-orange transition">
                          <Play size={16} className="text-white fill-white ml-0.5" />
                        </span>
                      </button>
                    </div>

                    <h3 className="font-heading text-sm sm:text-base uppercase mt-4 mb-1">
                      {review.productName}
                    </h3>
                    <p className="font-body text-sm text-gray-700 mb-3">₹{review.price}.00</p>
                    <button
                      onClick={() => console.log("Add to cart:", review.productName)}
                      className="w-full bg-black text-white rounded-full py-2.5 font-heading text-sm font-medium hover:bg-brand-orange transition cursor-pointer"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewsCarousel;