import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Play, X, Volume2, VolumeX, Heart, Share2, Eye } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Reveal } from "../Reveal";
import api from "../../api/axios";
import CartToast from "../CartToast";
import { slugify } from "../../utils/slugify";

import "swiper/css";



const getVideoPoster = (videoUrl, atSeconds = 0.5) => {
  if (!videoUrl) return "";
  return videoUrl
    .replace("/upload/", `/upload/so_${atSeconds}/`)
    .replace(/\.(mp4|mov|webm)$/i, ".jpg");
};

const reviews = [
  {
    id: 1,
    productName: "RASMALAI OATS SHAKE",
    price: 149,
    productId: "6a33d8cefba92e569fc33a9a", 
    videoUrl: "https://res.cloudinary.com/imzegfzz/video/upload/v1783316335/review2_zehzq4.mp4",
  },
  {
    id: 2,
    productName: "RASMALAI OATS SHAKE",
    price: 149,
    productId: "6a33d8cefba92e569fc33a9a",
    videoUrl: "https://res.cloudinary.com/imzegfzz/video/upload/v1783316339/review3_mwk8hj.mp4",
  },
  {
    id: 3,
    productName: "MIDNIGHT LATTE",
    price: 200,
    productId: "6a33d647fba92e569fc33a98", 
    videoUrl: "https://res.cloudinary.com/imzegfzz/video/upload/v1783316344/review1_tvqqyv.mp4",
  },
];

const ReelModal = ({ review, onClose, onAddToCart, cartStatus }) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount] = useState(Math.floor(Math.random() * 900 + 100));
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const lastTap = useRef(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

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


const handleViewProduct = useCallback((e) => {
  e.stopPropagation();
  navigate(`/product/${review.productId}/${slugify(review.productName)}`);
}, [review.productId, review.productName, navigate]);

const handleShare = useCallback((e) => {
  e.stopPropagation();

  const productUrl = `${window.location.origin}/product/${review.productId}/${slugify(review.productName)}`;

  if (navigator.share) {
    navigator.share({
      title: review.productName,
      text: `Check out ${review.productName}!`,
      url: productUrl,
    });
  } else {
    navigator.clipboard?.writeText(productUrl);
  }
}, [review.productName, review.productId]);

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

        <video
          ref={videoRef}
          key={review.id}
          src={review.videoUrl}
          poster={getVideoPoster(review.videoUrl)}
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

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-10" onClick={togglePlay}>
            <span className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center cursor-pointer">
              <Play size={24} className="text-white fill-white ml-1" />
            </span>
          </div>
        )}

        <div className="absolute right-3 bottom-20 z-40 flex flex-col items-center gap-5">
          <button onClick={handleLike} aria-label="Like" className="flex flex-col items-center gap-1 cursor-pointer group">
            <Heart size={28} className={`transition-transform group-active:scale-125 ${liked ? "fill-red-500 text-red-500" : "text-white"}`} />
            <span className="text-white text-xs font-medium">{likeCount + (liked ? 1 : 0)}</span>
          </button>

          <button
            onClick={handleViewProduct}
            aria-label="View product"
            className="flex flex-col items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Eye size={26} className="text-white" />
            <span className="text-white text-xs font-medium">View</span>
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
            onClick={(e) => { e.stopPropagation(); onAddToCart(review); }}
            disabled={cartStatus === "loading"}
            className="w-full bg-white text-black rounded-full py-2.5 font-heading text-sm font-semibold hover:bg-brand-orange hover:text-white transition cursor-pointer disabled:opacity-60"
          >
            {cartStatus === "success" ? "ADDED ✓" : cartStatus === "loading" ? "ADDING..." : "ADD TO CART"}
          </button>
        </div>

        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-t-2xl z-30 overflow-hidden">
          <div className="h-full bg-white transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

const ReviewsCarousel = () => {
  const [openReview, setOpenReview] = useState(null);
  const [products, setProducts] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [cartStatus, setCartStatus] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/product");
      setProducts(res.data.products || res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const resolvedReviews = reviews.map((review) => {
    const matchedProduct = products.find((p) => p._id === review.productId);

    if (!matchedProduct) {
      return { ...review, product: null };
    }

    const unitPrice =
      matchedProduct.packSizes?.find((p) => p.units === 1)?.price ??
      matchedProduct.packSizes?.[0]?.price ??
      review.price;

    return {
      ...review,
      productName: matchedProduct.name,
      price: unitPrice,
      product: matchedProduct,
    };
  });

const handleAddToCart = async (review) => {
  if (!review.product) {
    setToast({
      show: true,
      message: "This flavour is coming soon — stay tuned!",
      variant: "info",
    });
    return;
  }

  if ((review.product.stock ?? 0) <= 0) {
    setToast({
      show: true,
      message: "This flavour is currently out of stock.",
      variant: "info",
    });
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to add items to your cart");
    navigate("/login");
    return;
  }

  if (cartStatus[review.id] === "loading") return;

  const defaultPack =
    review.product.packSizes?.find((p) => Number(p.units) === 1) ||
    review.product.packSizes?.[0];

  if (!defaultPack) {
    alert("Product pack missing");
    return;
  }

  setCartStatus((prev) => ({ ...prev, [review.id]: "loading" }));

  try {
    const res = await api.post(
      "/cart/add",
      {
        productId: review.product._id,
        quantity: 1,
        pack: {
          label: defaultPack.label,
          units: Number(defaultPack.units) || 1,
          price: Number(defaultPack.price),
        },
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updatedItems = res.data.items || [];
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    localStorage.setItem("cartCount", updatedItems.length);
    window.dispatchEvent(new Event("cartUpdated"));

    setCartStatus((prev) => ({ ...prev, [review.id]: "success" }));
    setToast({ show: true, message: "Added to cart successfully!", variant: "success" });

    setTimeout(() => {
      setCartStatus((prev) => ({ ...prev, [review.id]: "idle" }));
    }, 2000);
  } catch (error) {
    console.log(error.response?.data || error.message);
    setCartStatus((prev) => ({ ...prev, [review.id]: "idle" }));
  }
};

  const openReviewResolved = openReview
    ? resolvedReviews.find((r) => r.id === openReview.id)
    : null;

  return (
    <>
      {openReviewResolved && (
        <ReelModal
          key={openReviewResolved.id}
          review={openReviewResolved}
          onClose={() => setOpenReview(null)}
          onAddToCart={handleAddToCart}
          cartStatus={cartStatus[openReviewResolved.id]}
        />
      )}

      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <Reveal variant="subtle" className="relative max-w-7xl mx-auto text-center">
          <img
            src="/images/arrow2.svg"
            alt=""
            className="hidden sm:block absolute left-4 md:left-40 top-15 w-16 h-12 pointer-events-none"
          />
          <img
            src="/images/arrow3.svg"
            alt="arrow"
            className="hidden sm:block absolute right-4 md:right-40 top-15 w-16 h-12 pointer-events-none"
          />
          <h2 className="font-heading text-3xl sm:text-4xl md:text-[56px] mb-2">
            CRUSH-WORTHY REVIEWS
          </h2>
          <p className="font-body text-gray-600 text-sm sm:text-base mb-12">
            Watch what people have to say
          </p>
        </Reveal>

        <div className="relative max-w-7xl mx-auto">
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
            {resolvedReviews.map((review, index) => {
              const status = cartStatus[review.id];

              return (
                <SwiperSlide key={review.id}>
                  <Reveal variant="subtle" delay={index * 0.1}>
                    <div className="text-left">
                      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-200" style={{ aspectRatio: "9 / 11" }}>
                        <img
                          src={getVideoPoster(review.videoUrl)}
                          alt={review.productName}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
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
                        onClick={() => handleAddToCart(review)}
                        disabled={status === "loading"}
                        className="w-full bg-black text-white rounded-full py-2.5 font-heading text-sm font-medium hover:bg-brand-orange transition cursor-pointer disabled:opacity-60"
                      >
                        {status === "success" ? "ADDED ✓" : status === "loading" ? "ADDING..." : "ADD TO CART"}
                      </button>
                    </div>
                  </Reveal>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>

      <CartToast
  show={toast.show}
  onClose={() => setToast((prev) => ({ ...prev, show: false }))}
  message={toast.message}
  variant={toast.variant}
/>
    </>
  );
};

export default ReviewsCarousel;