import { useEffect, useState } from "react";
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

import {
 
  Moon,
  GlassWater,
  Snowflake,
  Coffee,
  IceCreamCone,
  Soup,
  Bell
} from "lucide-react";

const iconMap = {
  moon: Moon,
  glass: GlassWater,
  snowflake: Snowflake,
  coffee: Coffee,
  bowl: Soup,
  icecream: IceCreamCone,
  bell: Bell,
};
export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [showViewCart, setShowViewCart] = useState(false);
    const [showToast, setShowToast] = useState(false);
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
    
const addToCart = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to add items to your cart");
            navigate("/login");
            return;
        }

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
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        const updatedItems = res.data.items || [];
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
        localStorage.setItem("cartCount", updatedItems.length); 

            setShowViewCart(true);
            window.dispatchEvent(new Event("cartUpdated"));
            setShowToast(true);
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };
    const buyNow = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login to add items to your cart");
                navigate("/login");
                return;
            }
            
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
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("Cart updated:", res.data);

            navigate("/checkout")
        } catch (error) {
            console.log(error.response?.data || error.message);
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
            alert("Please login to get notified");
            navigate("/login");
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
            alert(error.response?.data?.message || "Something went wrong");
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
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please login to add a review");
                navigate("/login");
                return;
            }

            await api.post(
                `/reviews/${id}`,
                {
                    rating,
                    comments
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Review added successfully");

            setRating(5);
            setComments("");

            fetchReviews();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to add review"
            );
        }
    };
    const handleWriteReview = () => {
        if (!token) {
            alert("Please login to write a review");
            navigate("/login");
            return;
        }


        setShowReviewForm(true);


    };
    const { openCart } = useCart();

    return (
        <><Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-10">

                <div className="grid md:grid-cols-2 gap-8 md:gap-12">

                    {/* LEFT SIDE - IMAGES */}
                    <div className="flex gap-3 sm:gap-4">
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

                        <div className="flex-1 rounded-2xl overflow-hidden aspect-square">
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* RIGHT SIDE - PRODUCT INFO */}
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

                        <p
                            className={`font-body text-sm text-gray-600 mb-6 ${
                                showFullDescription ? "" : "line-clamp-3"
                            }`}
                        >
                            {product.description}
                            {!showFullDescription && (
                                <>
                                    {"... "}
                                    <button
                                        onClick={() => setShowFullDescription(true)}
                                        className="text-brand-orange underline cursor-pointer font-medium"
                                    >
                                        Read More
                                    </button>
                                </>
                            )}
                        </p>

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
                                                <button
                                                    onClick={() => setSelectedPack(pack)}
                                                    className={`font-body text-sm font-medium px-5 py-2 rounded-full border-2 transition cursor-pointer ${
                                                        isActive
                                                            ? "bg-brand-orange border-brand-orange text-white"
                                                            : "bg-white border-gray-200 text-black hover:border-brand-orange"
                                                    }`}
                                                >
                                                    {pack.label}
                                                </button>

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
                            <span className="font-heading text-3xl">
                                ₹{selectedPack?.price}.00
                            </span>
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
    disabled={isUnavailable}
    className={`flex-1 border-2 font-heading text-base py-3 rounded-full shadow-md transition ${
      isUnavailable
        ? "border-gray-300 text-gray-400 cursor-not-allowed"
        : "border-brand-orange text-black hover:-translate-y-1 cursor-pointer"
    }`}
>
    BUY NOW
</button>

<button
    onClick={isSoldOut ? handleNotify : addToCart}
    disabled={isSoldOut && (notifyStatus === "loading" || notifyStatus === "success")}
    className={`flex-1 font-heading text-base py-3 rounded-full shadow-md transition flex items-center justify-center gap-2 ${
      isSoldOut
        ? "bg-gray-400 text-white cursor-pointer disabled:cursor-default"
        : "bg-brand-orange text-white hover:-translate-y-1 cursor-pointer"
    }`}
  >
    {isSoldOut ? (
      notifyStatus === "success" ? (
        "SUBSCRIBED ✓"
      ) : notifyStatus === "loading" ? (
        "SENDING..."
      ) : (
        <>NOTIFY <Bell size={16} /></>
      )
    ) : (
      "ADD TO CART"
    )}
  </button>
</div>

                    </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 text-center">
                    <div className="flex flex-col items-center">
                        <Truck size={44} strokeWidth={2.5} className="text-brand-orange mb-3" />
                        <p className="font-body font-semibold text-sm mb-1">
                            Fast Delivery
                        </p>
                        <p className="font-body text-xs text-gray-500">
                            Delivered within 3-5 business days
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <RotateCcw size={44} strokeWidth={2.5} className="text-brand-orange mb-3" />
                        <p className="font-body font-semibold text-sm mb-1">
                            Easy Returns
                        </p>
                        <p className="font-body text-xs text-gray-500">
                            Hassle-free returns within 7 days
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <Lock size={44} strokeWidth={2.5} className="text-brand-orange mb-3" />
                        <p className="font-body font-semibold text-sm mb-1">
                            Secure Checkout
                        </p>
                        <p className="font-body text-xs text-gray-500">
                            Your payments are protected and encrypted
                        </p>
                    </div>
                </div>

                {showViewCart && (
    <div className="fixed bottom-3 left-0 w-full z-50 bg-brand-orange text-white px-8 py-4 flex justify-between items-center shadow-lg rounded-full">
        <span>Item added to cart</span>
<button
    onClick={() => openCart()}
    className="bg-white font-heading text-brand-orange px-8 py-2 rounded hover:translate-y-[-2px] transition cursor-pointer rounded-full shadow-md"
>
    VIEW CART
</button>
    </div>
)}

            </div>
            {product.howToEnjoy?.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
                    <h2 className="font-heading text-3xl sm:text-4xl md:text-[44px] text-center mb-10 sm:mb-12">
                        HOW TO ENJOY
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {product.howToEnjoy.map((item, index) => {
                            const Icon = iconMap[item.icon];

                            return (
                                <div
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
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
                <h2 className="font-heading text-3xl sm:text-4xl md:text-[44px] mb-8">
                    CUSTOMER REVIEWS
                </h2>

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
                                className="bg-brand-orange font-body text-white px-6 py-2 rounded-full cursor-pointer hover-transition hover:-translate-y-1 shadow-md transition"
                            >
                                Submit Review
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                                        <div
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
                                        </div>
                                    ));
                            })()}
                        </div>

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
            {product.nutrition && product.nutrition.nutrients?.length > 0 && (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        
        <h2 className="font-heading text-3xl sm:text-4xl md:text-[44px] mb-10 text-center">
            NUTRITION INFORMATION
        </h2>

        {/* Header Info */}
        <div className="mb-8 text-center">
            <p className="font-body text-sm text-gray-600">
                Serving Size:{" "}
                <span className="font-semibold text-black">
                    {product.nutrition.servingSize || "—"}
                </span>
            </p>

            <p className="font-body text-sm text-gray-600">
                Servings Per Pack:{" "}
                <span className="font-semibold text-black">
                    {product.nutrition.servingsPerPack || "—"}
                </span>
            </p>

            {product.nutrition.note && (
                <p className="font-body text-xs text-gray-500 mt-2 italic">
                    {product.nutrition.note}
                </p>
            )}
        </div>

        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-5 font-body text-xs font-semibold text-gray-500 border-b pb-2 mb-4">
            <span>NUTRIENT</span>
            <span>PER SERVING</span>
            <span>PER 100g</span>
            <span>UNIT</span>
            <span>% DAILY VALUE</span>
        </div>

        {/* Nutrients List */}
        <div className="space-y-4">
            {product.nutrition.nutrients.map((n, index) => (
                <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 items-center border-b pb-4"
                >
                    {/* Name */}
                    <span className="font-body font-medium text-sm">
                        {n.name}
                    </span>

                    {/* Per Serving */}
                    <span className="font-body text-sm text-gray-600">
                        {n.perServing} {n.unit}
                    </span>

                    {/* Per 100g */}
                    <span className="font-body text-sm text-gray-600">
                        {n.per100g} {n.unit}
                    </span>

                    {/* Unit */}
                    <span className="font-body text-sm text-gray-600 uppercase">
                        {n.unit}
                    </span>

                    {/* Daily Value Bar */}
                    <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-brand-orange"
                                style={{
                                    width: `${Math.min(n.dailyValue || 0, 100)}%`
                                }}
                            />
                        </div>

                        <span className="text-xs font-body text-gray-600 min-w-[35px]">
                            {n.dailyValue || 0}%
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </section>
)}
            <Footer />
            <CartToast show={showToast} onClose={() => setShowToast(false)} />
        </>
    );
}