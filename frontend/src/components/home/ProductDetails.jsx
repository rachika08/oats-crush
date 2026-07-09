import { useEffect, useState, useRef  } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Star, Truck, RotateCcw, Lock, ChevronDown } from "lucide-react";
import api from "../../api/axios";
import Navbar from "../Navbar";
import Footer from "./Footer";
import FAQSection from "./FAQSection";
import FeaturedProducts from "./FeaturedProducts";
import CartToast from "../CartToast";
import { useCart } from "../../context/CartContext";
import PageFade from "../PageFade";
import { Reveal, RevealGroup, RevealItem } from "../Reveal";
import { motion, AnimatePresence } from "framer-motion";


import {
  Moon,
  GlassWater,
  Snowflake,
  Coffee,
  IceCreamCone,
  Soup,
  Bell,
  Blender,
} from "lucide-react";


const iconMap = {
  moon: Moon,
  glass: GlassWater,
  snowflake: Snowflake,
  coffee: Coffee,
  bowl: Soup,
  icecream: IceCreamCone,
  bell: Bell,
  blender: Blender,
};
export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [showViewCart, setShowViewCart] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", variant: "success" });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [notifyStatus, setNotifyStatus] = useState("idle");
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comments, setComments] = useState("");

    // const [selectedPack, setSelectedPack] = useState(1);
    const [selectedPack, setSelectedPack] = useState(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [reviewSort, setReviewSort] = useState("");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [visibleReviewCount, setVisibleReviewCount] = useState(6);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchProduct();
        fetchReviews();

    }, [id]);
    useEffect(() => {
        if (product) {
            fetchCartQuantity();
        }
    }, [product]);
    
const [addToCartLoading, setAddToCartLoading] = useState(false);
const [buyNowLoading, setBuyNowLoading] = useState(false);
const [submittingReview, setSubmittingReview] = useState(false);

const addToCart = async () => {
    if (addToCartLoading) return;
    try {
        const token = localStorage.getItem("token");
if (!token) {
            setToast({ show: true, message: "Please login to add items to your cart", variant: "info" });
            setTimeout(() => navigate("/login"), 800);
            return;
        }

        setAddToCartLoading(true);

        const res = await api.post(
            "/cart/add",
            {
                productId: product._id,
                quantity: quantity,
                pack: {
                    label: selectedPack.label,
                    units: selectedPack.units,
                    price: selectedPack.price
                }
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const updatedItems = res.data.items || [];
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
        localStorage.setItem("cartCount", updatedItems.length);

        setShowViewCart(true);
        window.dispatchEvent(new Event("cartUpdated"));
        setToast({ show: true, message: "Added to cart successfully!", variant: "success" });
    } catch (error) {
        console.log(error.response?.data || error.message);
    } finally {
        setAddToCartLoading(false);
    }
};

const buyNow = async () => {
    if (buyNowLoading) return;
    try {
        const token = localStorage.getItem("token");
if (!token) {
            setToast({ show: true, message: "Please login to add items to your cart", variant: "info" });
            setTimeout(() => navigate("/login"), 800);
            return;
        }

        setBuyNowLoading(true);

        const res = await api.post(
            "/cart/add",
            {
                productId: product._id,
                quantity: quantity,
                pack: {
                    label: selectedPack.label,
                    units: selectedPack.units,
                    price: selectedPack.price
                }
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Cart updated:", res.data);

        navigate("/checkout");
    } catch (error) {
        console.log(error.response?.data || error.message);
        setBuyNowLoading(false);
    }
};

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/product/${id}`);
            console.log(res);
            setProduct(res.data);
            setSelectedImage(res.data.image);
            const packs = res.data.packSizes || [];
            const pack6 = packs.find(p => p.units === 6);
            setSelectedPack(pack6 || packs[0]);
        } catch (error) {
            console.log(error);
        }
    };
    const fetchReviews = async () => {
        try {
            const res = await api.get(`/reviews/${id}`);
            setReviews(res.data);
        } catch (error) {
            console.log(error);
        }
    };

const handleNotify = async () => {
        if (notifyStatus === "loading" || notifyStatus === "success") return;

const token = localStorage.getItem("token");
        if (!token) {
            setToast({ show: true, message: "Please login to get notified", variant: "info" });
            setTimeout(() => navigate("/login"), 800);
            return;
        }

        setNotifyStatus("loading");

        try {
            await api.post(
                "/notification/notify",
                { productId: product._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotifyStatus("success");
        } catch (error) {
            console.log(error.response?.data || error.message);

            if (error.response?.data?.message === "Already subscribed") {
                setNotifyStatus("success");
                return;
            }

setNotifyStatus("idle");
            setToast({ show: true, message: error.response?.data?.message || "Something went wrong", variant: "info" });
        }
    };

    const fetchCartQuantity = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) return;

            const res = await api.get("/cart", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const cartItem = res.data.items.find(
                item => item.product._id === id
            );

            if (cartItem) {
                setQuantity(cartItem.quantity);
                setShowViewCart(true);
            }

        } catch (error) {
            console.log(error);
        }
    };
    if (!product) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );
    }
const isSoldOut = product.stock <= 0; 
const isUnlaunched = product.isLaunched === false;
const isUnavailable = isUnlaunched || isSoldOut;
    const allImages = [
        product.image,
        ...(product.additionalImages || [])
    ];
    const averageRating =
        reviews.length > 0
            ? (
                reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                ) / reviews.length
            ).toFixed(1)
            : 0;

const submitReview = async () => {
    if (submittingReview) return;
    setSubmittingReview(true);
    try {
        const token = localStorage.getItem("token");

if (!token) {
            setToast({ show: true, message: "Please login to add a review", variant: "info" });
            setTimeout(() => navigate("/login"), 800);
            return;
        }

        await api.post(
            `/reviews/${id}`,
            { rating, comments },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setToast({ show: true, message: "Review added successfully", variant: "success" });

        setRating(5);
        setComments("");

        fetchReviews();
    } catch (error) {
        setToast({ show: true, message: error.response?.data?.message || "Failed to add review", variant: "info" });
    } finally {
        setSubmittingReview(false);
    }
};

const handleWriteReview = () => {
        if (!token) {
            setToast({ show: true, message: "Please login to write a review", variant: "info" });
            setTimeout(() => navigate("/login"), 800);
            return;
        }

        setShowReviewForm(true);


    };
    const { openCart } = useCart();

    return (
        <PageFade>
        <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-10">

                <div className="grid md:grid-cols-2 gap-8 md:gap-12">

{/* Mobile: hero image on top, swipeable thumbnail row below */}
<Reveal variant="subtle" className="md:hidden min-w-0">
<div className="relative rounded-2xl overflow-hidden aspect-square mb-3">
    <AnimatePresence mode="wait">
      <motion.img
        key={selectedImage}
        src={selectedImage}
        alt={product.name}
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full h-full object-cover"
      />
    </AnimatePresence>
    {isUnavailable && (
      <motion.span
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-3 left-3 text-xs font-body font-medium px-3 py-1 rounded-full ${
          isUnlaunched ? "bg-white text-brand-orange-dark" : "bg-white text-black"
        }`}
      >
        {isUnlaunched ? "Coming Soon" : "Sold Out"}
      </motion.span>
    )}
  </div>

  <div className="relative min-w-0">
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {allImages.map((img, index) => (
        <button
          key={index}
          onClick={() => setSelectedImage(img)}
          className={`snap-center flex-shrink-0 w-16 aspect-square rounded-lg overflow-hidden border-2 transition cursor-pointer ${
            selectedImage === img ? "border-brand-orange" : "border-gray-200"
          }`}
        >
          <img src={img} alt={`thumbnail-${index}`} className="w-full h-full object-cover" />
        </button>
      ))}
    </div>

    {allImages.length > 4 && (
      <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-10 bg-gradient-to-l from-white to-transparent" />
    )}
</div>
</Reveal>

                    {/* Desktop: vertical thumbnail column beside the main image */}
                    <Reveal variant="subtle" className="hidden md:flex gap-3 sm:gap-4">
                        <div className="flex flex-col gap-3 w-16 sm:w-20 flex-shrink-0">
                            {allImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(img)}
                                    className={`aspect-square rounded-lg sm:rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                                        selectedImage === img
                                            ? "border-brand-orange"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <img
                                        src={img}
                                        alt={`thumbnail-${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

<div className="relative flex-1 rounded-2xl overflow-hidden aspect-square">
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={selectedImage}
                                src={selectedImage}
                                alt={product.name}
                                initial={{ opacity: 0, scale: 1.02 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="w-full h-full object-cover"
                              />
                            </AnimatePresence>
                            {isUnavailable && (
                              <motion.span
                                animate={{ opacity: [1, 0.6, 1] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                                className={`absolute top-3 left-3 text-xs font-body font-medium px-3 py-1 rounded-full ${
                                  isUnlaunched ? "bg-white text-brand-orange-dark" : "bg-white text-black"
                                }`}
                              >
                                {isUnlaunched ? "Coming Soon" : "Sold Out"}
                              </motion.span>
                            )}
                        </div>
                    </Reveal>

                    {/* RIGHT SIDE - PRODUCT INFO */}
                    <Reveal variant="subtle" delay={0.1}>
                    <div>

                        {product.isNewLaunch && (
                            <span className="inline-block bg-brand-orange text-white font-body text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
                                New Launch
                            </span>
                        )}

                        <h1 className="font-heading text-3xl sm:text-4xl leading-tight mb-3 uppercase">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex text-brand-orange">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={16}
                                        className={
                                            star <= Math.round(averageRating)
                                                ? "fill-brand-orange text-brand-orange"
                                                : "fill-gray-200 text-gray-200"
                                        }
                                    />
                                ))}
                            </div>
                            <span className="font-body text-sm font-semibold">
                                {averageRating}
                            </span>
                            <span className="font-body text-sm text-gray-500">
                                ({reviews.length >= 1000
                                    ? `${(reviews.length / 1000).toFixed(1)}k`
                                    : reviews.length}{" "}
                                reviews)
                            </span>
                        </div>

                        <div className="mb-6">
                            <p
                                className={`font-body text-sm text-gray-600 ${
                                    showFullDescription ? "" : "line-clamp-2"
                                }`}
                            >
                                {product.description}
                            </p>
                            {!showFullDescription && (
                                <button
                                    onClick={() => setShowFullDescription(true)}
                                    className="text-brand-orange underline cursor-pointer font-medium text-sm mt-1"
                                >
                                    Read More
                                </button>
                            )}
                        </div>

                        {/* Pack size selector */}
                        <div className="mb-6">
                            <p className="font-body text-xs font-medium text-gray-500 tracking-wide mb-3">
                                SELECT YOUR PACK SIZE
                            </p>

                            <div className="flex gap-3 flex-wrap">
                                {(() => {
                                    const baseUnitPrice =
                                        product.packSizes?.[0]?.price /
                                        product.packSizes?.[0]?.units;

                                    return product.packSizes?.map((pack) => {
                                        const fullPrice = baseUnitPrice * pack.units;
                                        const savings = Math.round(
                                            ((fullPrice - pack.price) / fullPrice) * 100
                                        );
                                        const hasSavings = savings > 0;
                                        const isActive =
                                            selectedPack?.units === pack.units;

                                        return (
                                            <div key={pack._id} className="relative">
<motion.button
                                                    onClick={() => setSelectedPack(pack)}
                                                    animate={{ scale: isActive ? 1.05 : 1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                                    className={`font-body text-sm font-medium px-5 py-2 rounded-full border-2 cursor-pointer ${
                                                        isActive
                                                            ? "bg-brand-orange border-brand-orange text-white"
                                                            : "bg-white border-gray-200 text-black hover:border-brand-orange"
                                                    }`}
                                                >
                                                    {pack.label}
                                                </motion.button>

                                                {hasSavings && (
                                                    <span
                                                        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                                            isActive
                                                                ? "bg-white text-green border-green"
                                                                : "bg-white text-gray-500 border-gray-200"
                                                        }`}
                                                    >
                                                        Save {savings}%
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>

                        {/* Price */}
<div className="flex items-baseline gap-2 mb-1">
    <AnimatePresence mode="wait">
        <motion.span
            key={selectedPack?.price}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="font-heading text-3xl"
        >
            ₹{selectedPack?.price}.00
        </motion.span>
    </AnimatePresence>
                            {selectedPack && selectedPack.units > 1 && (
                                <span className="font-body text-sm text-gray-400">
                                    ₹{(selectedPack.price / selectedPack.units).toFixed(0)}/pouch
                                </span>
                            )}
                        </div>

                        <p className="font-body text-xs text-gray-400 mb-6">
                            Incl. of all taxes &amp; shipping
                        </p>

                        {/* Quantity stepper */}
                        <div className="flex items-center border-2 border-brand-orange rounded-full w-fit mb-6">
                            <button
                                onClick={() =>
                                    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                                }
                                className="w-10 h-10 flex items-center justify-center font-body text-lg cursor-pointer"
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>

                            <span className="font-body font-medium w-8 text-center">
                                {quantity}
                            </span>

                            <button
    onClick={() =>
        setQuantity((prev) => (prev < product.stock ? prev + 1 : prev))
    }
    disabled={quantity >= product.stock}
                                className="w-10 h-10 flex items-center justify-center font-body text-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
<button
    onClick={buyNow}
    disabled={isUnavailable || buyNowLoading}
    className={`flex-1 border-2 font-heading text-base py-3 rounded-full shadow-md transition ${
      isUnavailable
        ? "border-gray-300 text-gray-400 cursor-not-allowed"
        : "border-brand-orange text-black hover:-translate-y-1 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    }`}
>
    {buyNowLoading ? "PROCESSING..." : "BUY NOW"}
</button>

<button
    onClick={isUnavailable ? handleNotify : addToCart}
    disabled={
      isUnavailable
        ? notifyStatus === "loading" || notifyStatus === "success"
        : addToCartLoading
    }
    className={`flex-1 font-heading text-base py-3 rounded-full shadow-md transition flex items-center justify-center gap-2 ${
      isUnavailable
        ? "bg-gray-400 text-white cursor-pointer disabled:cursor-default"
        : "bg-brand-orange text-white hover:-translate-y-1 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    }`}
  >
    {isUnavailable ? (
      notifyStatus === "success" ? (
        "SUBSCRIBED ✓"
      ) : notifyStatus === "loading" ? (
        "SENDING..."
      ) : (
        <>NOTIFY <Bell size={16} /></>
      )
    ) : addToCartLoading ? (
      "ADDING..."
    ) : (
      "ADD TO CART"
    )}
  </button>
</div>

</div>
                    </Reveal>
                </div>

                {/* Trust Badges */}
                <RevealGroup staggerDelay={0.1} className="grid grid-cols-3 gap-4 sm:gap-6 mt-20 sm:mt-26 text-center">
<RevealItem variant="subtle" className="flex flex-col items-center">
                        <Truck size={44} strokeWidth={2.5} className="text-brand-orange mb-3" />
                        <p className="font-body font-semibold text-sm mb-1">
                            Fast Delivery
                        </p>
                        <p className="font-body text-xs text-gray-500 hidden sm:block">
                            Delivered within 3-5 business days
                        </p>
                    </RevealItem>

                    <RevealItem variant="subtle" className="flex flex-col items-center">
                        <RotateCcw size={44} strokeWidth={2.5} className="text-brand-orange mb-3" />
                        <p className="font-body font-semibold text-sm mb-1">
                            Easy Returns
                        </p>
                        <p className="font-body text-xs text-gray-500 hidden sm:block">
                            Hassle-free returns within 7 days
                        </p>
                    </RevealItem>

                    <RevealItem variant="subtle" className="flex flex-col items-center">
                        <Lock size={44} strokeWidth={2.5} className="text-brand-orange mb-3" />
                        <p className="font-body font-semibold text-sm mb-1">
                            Secure Checkout
                        </p>
                        <p className="font-body text-xs text-gray-500 hidden sm:block">
                            Your payments are protected and encrypted
                        </p>
                    </RevealItem>
                </RevealGroup>

{product.ingredientGallery?.length > 0 && (
<Reveal variant="noticeable" className="mt-20 sm:mt-26">
    <h2 className="font-heading text-3xl sm:text-4xl md:text-[44px] uppercase text-center mb-8 sm:mb-10">
      What's Inside
    </h2>

    <div className="marquee-wrapper overflow-hidden -mx-4 sm:-mx-6 px-4 sm:px-6">
      <div className="marquee-track gap-8 sm:gap-10 py-4" style={{ "--marquee-duration": "58s" }}>
        {Array.from({ length: 6 })
          .flatMap((_, i) =>
            product.ingredientGallery.map((item, j) => ({ ...item, key: `${i}-${j}` }))
          )
          .map((item) => (
            <div key={item.key} className="flex-shrink-0 flex flex-col items-center text-center w-28 sm:w-32 md:w-40">
             <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-100 shadow-lg mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-body text-sm font-medium">{item.name}</p>
            </div>
          ))}
      </div>
    </div>
  </Reveal>
)}

{/* Nutritional Value */}
{product.nutrition && product.nutrition.nutrients?.length > 0 && (
<div className="mt-12 sm:mt-16 max-w-5xl mx-auto">

    <Reveal variant="noticeable">
    <h2 className="font-heading text-3xl sm:text-4xl mb-8 sm:mb-10 uppercase text-center">
        Nutritional Value
    </h2>
    </Reveal>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

        {/* Left - image only */}
        {product.additionalImages?.length > 0 && (
            <Reveal variant="subtle" className="rounded-2xl sm:rounded-3xl overflow-hidden">
                <img
                    src={product.additionalImages[product.additionalImages.length - 1]}
                    alt={`${product.name} nutrition facts`}
                    className="w-full h-full object-contain"
                />
            </Reveal>
        )}

        {/* Right - nutrients + badges */}
        <div>
        <RevealGroup staggerDelay={0.08} className="space-y-5">
{product.nutrition.nutrients.map((n, index) => (
                <RevealItem variant="subtle" key={index}>
                    <div className="flex items-baseline justify-between gap-2 mb-1.5">
                        <span className="font-body text-sm font-semibold text-black">
                            {n.name}{" "}
                            <span className="font-body text-xs font-normal text-gray-400">
                                {n.perServing} / {n.per100g} {n.unit}
                            </span>
                        </span>
                        <span className="font-body text-sm font-semibold text-black flex-shrink-0">
                            {n.dailyValue}%
                        </span>
                    </div>
<div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
    <motion.div
        className={`h-full rounded-full ${index === 0 ? "bg-brand-orange" : "bg-gray-400"}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.min(n.dailyValue || 0, 100)}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.08, ease: "easeOut" }}
    />
</div>
</RevealItem>
            ))}
        </RevealGroup>

{product.nutrition.note && (
            <p className="font-body text-xs text-gray-500 italic mt-4">
                *{product.nutrition.note}
            </p>
        )}

        <hr className="border-gray-200 my-8" />

{/* Static claims — same on every product */}
        <RevealGroup staggerDelay={0.1} className="grid grid-cols-3 gap-4 text-left">
            <RevealItem variant="subtle" className="flex flex-col items-center">
                <span
                    className="icon-mask w-14 h-14 mb-2 bg-brand-orange"
                    style={{ WebkitMaskImage: `url(/images/icon-zero-sugar.svg)`, maskImage: `url(/images/icon-zero-sugar.svg)` }}
                />
                <p className="font-heading text-base uppercase">Zero</p>
                <p className="font-body text-xs text-gray-500">Refined Sugar</p>
            </RevealItem>

            <RevealItem variant="subtle" className="flex flex-col items-center">
                <span
                    className="icon-mask w-14 h-14 mb-2 bg-brand-orange"
                    style={{ WebkitMaskImage: `url(/images/icon-drop.svg)`, maskImage: `url(/images/icon-drop.svg)` }}
                />
                <p className="font-heading text-base uppercase">Zero</p>
                <p className="font-body text-xs text-gray-500">Trans Fat</p>
            </RevealItem>

            <RevealItem variant="subtle" className="flex flex-col items-center">
                <span
                    className="icon-mask w-14 h-14 mb-2 bg-brand-orange"
                    style={{ WebkitMaskImage: `url(/images/icon-fillers.webp)`, maskImage: `url(/images/icon-fillers.webp)` }}
                />
                <p className="font-heading text-base uppercase">No</p>
                <p className="font-body text-xs text-gray-500">Preservatives or Fillers</p>
            </RevealItem>
        </RevealGroup>
        </div>
    </div>
</div>
)}

{showViewCart && (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white px-6 sm:px-8 py-4 flex items-center justify-between gap-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <span className="font-body text-sm text-black">
                Item added to cart
            </span>
        </div>
        <button
            onClick={() => openCart()}
           className="bg-brand-orange font-heading text-white px-8 py-2 rounded hover:translate-y-[-2px] transition cursor-pointer rounded-full shadow-md"
        >
            VIEW CART
        </button>
    </div>
)}

            </div>
            {product.howToEnjoy?.length > 0 && (
 <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
                    <Reveal variant="noticeable">
                    <h2 className="font-heading text-3xl sm:text-4xl md:text-[44px] text-center mb-10 sm:mb-12">
                        HOW TO ENJOY
                    </h2>
                    </Reveal>

                    <RevealGroup staggerDelay={0.12} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {product.howToEnjoy.map((item, index) => {
                            const Icon = iconMap[item.icon];

                            return (
                                <RevealItem
                                    variant="subtle"
                                    key={index}
                                    className="border-2 border-brand-orange rounded-2xl p-6 text-left shadow-md hover:-translate-y-1"
                                >
                                    {Icon && (
                                        <Icon
                                            size={50}
                                            strokeWidth={2}
                                            className="text-brand-orange mb-4"
                                        />
                                    )}

                                    <h3 className="font-heading text-base sm:text-lg uppercase mb-2">
                                        {item.title}
                                    </h3>

                                    <p className="font-body text-sm text-gray-500 leading-relaxed">
                                        {item.description}
                                    </p>
</RevealItem>
                            );
                        })}
                    </RevealGroup>
                </section>
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
                <Reveal variant="noticeable">
                <h2 className="font-heading text-3xl sm:text-4xl md:text-[44px] mb-8">
                    CUSTOMER REVIEWS
                </h2>
                </Reveal>
                {/* Header row: rating summary / write review / sort */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="flex text-brand-orange">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={18}
                                    className={
                                        star <= Math.round(averageRating)
                                            ? "fill-brand-orange text-brand-orange"
                                            : "fill-gray-200 text-gray-200"
                                    }
                                />
                            ))}
                        </div>
                        <span className="font-body text-sm font-semibold">
                            {averageRating}
                        </span>
                        <span className="font-body text-sm text-gray-500">
                            ({reviews.length >= 1000
                                ? `${(reviews.length / 1000).toFixed(1)}k`
                                : reviews.length}{" "}
                            reviews)
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleWriteReview}
                            className="bg-brand-orange text-white font-heading text-sm px-6 py-2.5 rounded-full shadow-md hover:-translate-y-1 transition cursor-pointer"
                        >
                            WRITE A REVIEW
                        </button>

                        <div className="relative">
                            <button
    onClick={() => setIsSortOpen(!isSortOpen)}
    className="flex items-center gap-2 border-2 border-gray-200 rounded-full px-5 py-2.5 font-body text-sm font-medium cursor-pointer hover:border-brand-orange transition"
>
    {reviewSort || "Sort"}
    <ChevronDown
        size={14}
        className={`transition-transform duration-200 ${
            isSortOpen ? "rotate-180" : ""
        }`}
    />
</button>

{isSortOpen && (
    <div className="absolute top-12 right-0 bg-white border rounded-xl shadow-md min-w-[160px] py-2 z-20 text-sm">
        {reviewSort && (
            <button
                onClick={() => {
                    setReviewSort("");
                    setIsSortOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-100 transition-colors duration-150 cursor-pointer border-b border-gray-100"
            >
                ✕ Clear
            </button>
        )}
        {["Top Rated", "Newest"].map((option) => (
            <button
                key={option}
                onClick={() => {
                    setReviewSort(option);
                    setIsSortOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-brand-orange transition-colors duration-150 cursor-pointer"
            >
                {option}
            </button>
        ))}
    </div>
)}
                        </div>
                    </div>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                    <div className="bg-gray-50 p-6 rounded-xl mb-10">

                        <h3 className="text-xl font-semibold mb-4">
                            WRITE A REVIEW
                        </h3>

                        <div className="mb-4">
                            <label className="block mb-2 font-medium">
                                Rating
                            </label>

                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={30}
                                        onClick={() => setRating(star)}
                                        className={`cursor-pointer transition ${star <= rating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300 hover:text-yellow-400"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <textarea
                            placeholder="Write your review..."
                            value={comments}
                            onChange={(e) =>
                                setComments(e.target.value)
                            }
                            className="w-full border border-2 border-brand-orange p-3 rounded mb-4"
                            rows="4"
                        />

                        <div className="flex gap-4">
<button
    onClick={submitReview}
    disabled={submittingReview}
    className="bg-brand-orange font-body text-white px-6 py-2 rounded-full cursor-pointer hover-transition hover:-translate-y-1 shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
>
    {submittingReview ? "SUBMITTING..." : "Submit Review"}
</button>

                            <button
                                onClick={() => setShowReviewForm(false)}
                                className="border border-2 border-brand-orange px-6 py-2 rounded-full cursor-pointer hover-transition hover:-translate-y-1 shadow-md transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Reviews Grid */}
                {reviews.length === 0 ? (
                    <p className="font-body text-gray-500">No reviews yet.</p>
                ) : (
<>
                        <RevealGroup staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {(() => {
                                const sortedReviews =
    reviewSort === ""
        ? reviews
        : [...reviews].sort((a, b) => {
              if (reviewSort === "Newest") {
                  return (
                      new Date(b.createdAt) -
                      new Date(a.createdAt)
                  );
              }
              // Top Rated
              return b.rating - a.rating;
          });

return sortedReviews
                                    .slice(0, visibleReviewCount)
                                    .map((review) => (
                                        <RevealItem
                                            variant="subtle"
                                            key={review._id}
                                            className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-5"
                                        >
                                            <p className="font-body text-sm text-black mb-4">
                                                "{review.comments}"
                                            </p>

                                            <div className="flex text-brand-orange mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={14}
                                                        className={
                                                            star <= review.rating
                                                                ? "fill-brand-orange text-brand-orange"
                                                                : "fill-gray-200 text-gray-200"
                                                        }
                                                    />
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                
                                                <span className="font-body text-sm text-gray-700">
                                                    {review.user?.name}
                                                </span>
                                            </div>
</RevealItem>
                                    ));
                            })()}
                        </RevealGroup>

                        {visibleReviewCount < reviews.length && (
                            <div className="flex justify-center mt-10">
                                <button
                                    onClick={() =>
                                        setVisibleReviewCount((prev) => prev + 6)
                                    }
                                    className="flex items-center gap-2 border-2 border-brand-orange rounded-full px-6 py-2.5 font-heading text-sm font-medium hover:border-black transition cursor-pointer"
                                >
                                    LOAD MORE
                                    <RotateCcw size={14} />
                                </button>
                            </div>
                        )}
                    </>
                    
                )}

            </div>
            <FeaturedProducts
                excludeProductId={product._id}
                heading="EXPLORE SIMILAR PRODUCTS"
                subheading="Discover more delicious options you'll love."
                showSquiggle={false}
            />
            <FAQSection faqs={product.faqs} image={product.image}/>

            <Footer />
            <CartToast
  show={toast.show}
  onClose={() => setToast((prev) => ({ ...prev, show: false }))}
  message={toast.message}
  variant={toast.variant}
/>
</PageFade>
    );
}