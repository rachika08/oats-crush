import { useState, useRef, useEffect, useCallback } from "react";
import { Play, X, Volume2, VolumeX, Heart, Share2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

const reviews = [
  {
    id: 1,
    videoThumbnail: "/images/coffee.png",
    productName: "RASMALAI OATS SHAKE",
    price: 120,
    productId: "",
    videoUrl: "https://res.cloudinary.com/dg9uyzo0b/video/upload/v1782654214/WhatsApp_Video_2026-06-28_at_7.11.05_PM_jwwjqd.mp4",
  },
  {
    id: 2,
    videoThumbnail: "/images/oat-milk.png",
    productName: "COFFEE OATS SHAKE",
    price: 120,
    productId: "",
    videoUrl: "https://res.cloudinary.com/dg9uyzo0b/video/upload/v1782654214/WhatsApp_Video_2026-06-28_at_7.11.05_PM_jwwjqd.mp4",
  },
  {
    id: 3,
    videoThumbnail: "/images/rasmalai.png",
    productName: "MIDNIGHT LATTE",
    price: 140,
    productId: "",
    videoUrl: "https://res.cloudinary.com/dg9uyzo0b/video/upload/v1782654214/WhatsApp_Video_2026-06-28_at_7.11.05_PM_jwwjqd.mp4",
  },
];

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
  const [activeIndex, setActiveIndex] = useState(Math.floor(reviews.length / 2));
  const [openReview, setOpenReview] = useState(null);

  const activeReview = reviews[activeIndex];

  return (
    <>
      {openReview && (
        <ReelModal
          key={openReview.id}
          review={openReview}
          onClose={() => setOpenReview(null)}
        />
      )}

      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-[56px] mb-2">
            CRUSH-WORTHY REVIEWS
          </h2>
          <p className="font-body text-gray-600 text-sm sm:text-base mb-12">
            Watch what people have to say
          </p>

          <div className="relative max-w-3xl mx-auto">
            <button className="reviews-prev hidden sm:flex absolute -left-2 sm:-left-6 md:-left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-brand-orange text-white text-4xl items-center justify-center shadow-md hover:-translate-x-1 transition cursor-pointer" aria-label="Previous">‹</button>
            <button className="reviews-next hidden sm:flex absolute -right-2 sm:-right-6 md:-right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-brand-orange text-white text-4xl items-center justify-center shadow-md hover:translate-x-1 transition cursor-pointer" aria-label="Next">›</button>

            <Swiper
              modules={[EffectCoverflow, Navigation]}
              effect="coverflow"
              grabCursor centeredSlides slidesPerView="auto"
              initialSlide={Math.floor(reviews.length / 2)}
              navigation={{ prevEl: ".reviews-prev", nextEl: ".reviews-next" }}
              coverflowEffect={{ rotate: 0, stretch: -40, depth: 150, modifier: 1.5, slideShadows: false }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              className="reviews-swiper !py-6"
            >
              {reviews.map((review, index) => {
                const isActive = index === activeIndex;
                return (
                  <SwiperSlide key={review.id} className="!w-52 sm:!w-72 md:!w-[340px]" style={{ zIndex: isActive ? 20 : 1 }}>
                    <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-200" style={{ aspectRatio: "9 / 11" }}>
                      <img src={review.videoThumbnail} alt={review.productName} className="absolute inset-0 w-full h-full object-cover" />
                      <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isActive ? "opacity-0" : "opacity-100"}`} />
                      {isActive && (
                        <button
                          aria-label="Play reel"
                          onClick={() => setOpenReview(review)}
                          className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                        >
                          <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black flex items-center justify-center group-hover:bg-brand-orange transition">
                            <Play size={18} className="text-white fill-white ml-0.5" />
                          </span>
                        </button>
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          <div className="mt-8 max-w-xs sm:max-w-sm mx-auto text-left">
            <h3 className="font-heading text-lg uppercase mb-1">{activeReview.productName}</h3>
            <p className="font-body text-sm text-gray-700 mb-4">₹{activeReview.price}.00</p>
            <button
              onClick={() => console.log("Add to cart:", activeReview.productName)}
              className="w-full bg-black text-white rounded-full py-3 font-heading text-base font-medium hover:bg-brand-orange transition cursor-pointer shadow-md hover:-translate-y-1"
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewsCarousel;