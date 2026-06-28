import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Star, Truck, RotateCcw, Lock } from "lucide-react";
import api from "../../api/axios";
import Navbar from "../Navbar";
import Footer from "./Footer";
import FAQSection from "./FAQSection";
import FeaturedProducts from "./FeaturedProducts";
import {
 
  Moon,
  GlassWater,
  Snowflake,
  Coffee,
  IceCreamCone,
  Soup
} from "lucide-react";

const iconMap = {
  moon: Moon,
  glass: GlassWater,
  snowflake: Snowflake,
  coffee: Coffee,
  bowl: Soup,
  icecream: IceCreamCone,
};
export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [showViewCart, setShowViewCart] = useState(false);

    const [showReviewForm, setShowReviewForm] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comments, setComments] = useState("");

    // const [selectedPack, setSelectedPack] = useState(1);
    const [selectedPack, setSelectedPack] = useState(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const token = localStorage.getItem("token");

    // useEffect(() => {
    //     fetchProduct();
    //     fetchReviews();

    // }, [id]);
    // useEffect(() => {
    //     if (product) {
    //         fetchCartQuantity();
    //     }
    // }, [product]);
    
    // Replace your three separate useEffects and fetch functions with this:

    useEffect(() => {
        const loadAll = async () => {
            try {
                const token = localStorage.getItem("token");

                const requests = [
                    api.get(`/product/${id}`),
                    api.get(`/reviews/${id}`),
                    token ? api.get("/cart", { headers: { Authorization: `Bearer ${token}` } }) : Promise.resolve(null)
                ];

                const [productRes, reviewsRes, cartRes] = await Promise.all(requests);

                // Product
                setProduct(productRes.data);
                setSelectedImage(productRes.data.image);
                setSelectedPack(productRes.data.packSizes?.[0]);

                // Reviews
                setReviews(reviewsRes.data);

                // Cart
                if (cartRes) {
                    const cartItem = cartRes.data.items.find(item => item.product._id === id);
                    if (cartItem) {
                        setQuantity(cartItem.quantity);
                        setShowViewCart(true);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadAll();
    }, [id]);

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
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setShowViewCart(true);
            alert("Added to cart!");
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

            navigate("/cart")
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    // const fetchProduct = async () => {
    //     try {
    //         const res = await api.get(`/product/${id}`);
    //         console.log(res);
    //         setProduct(res.data);
    //         setSelectedImage(res.data.image);
    //         setSelectedPack(res.data.packSizes?.[0]);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // const fetchReviews = async () => {
    //     try {
    //         const res = await api.get(`/reviews/${id}`);
    //         setReviews(res.data);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // const fetchCartQuantity = async () => {
    //     try {
    //         const token = localStorage.getItem("token");

    //         if (!token) return;

    //         const res = await api.get("/cart", {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });

    //         const cartItem = res.data.items.find(
    //             item => item.product._id === id
    //         );

    //         if (cartItem) {
    //             setQuantity(cartItem.quantity);
    //             setShowViewCart(true);
    //         }

    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // if (!product) {
    //     return (
    //         <div className="flex justify-center items-center h-screen">
    //             Loading...
    //         </div>
    //     );
    // }

    if (!product) {
    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-10 animate-pulse">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left: image skeleton */}
                    <div>
                        <div className="bg-gray-200 rounded-xl h-[500px] w-full mb-4" />
                        <div className="flex gap-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-gray-200 rounded-lg w-20 h-20" />
                            ))}
                        </div>
                    </div>

                    {/* Right: text skeleton */}
                    <div className="space-y-4">
                        <div className="bg-gray-200 h-4 w-24 rounded" />
                        <div className="bg-gray-200 h-10 w-3/4 rounded" />
                        <div className="bg-gray-200 h-8 w-32 rounded" />
                        <div className="bg-gray-200 h-4 w-full rounded" />
                        <div className="bg-gray-200 h-4 w-5/6 rounded" />
                        <div className="bg-gray-200 h-4 w-4/6 rounded" />
                        <div className="flex gap-3 mt-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-gray-200 h-10 w-24 rounded-full" />
                            ))}
                        </div>
                        <div className="flex gap-4 mt-6">
                            <div className="bg-gray-200 h-12 flex-1 rounded-lg" />
                            <div className="bg-gray-200 h-12 flex-1 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

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
                            <h3 className="font-body text-xs font-semibold text-gray-500 tracking-wide mb-3">
                                SELECT YOUR PACK SIZE
                            </h3>

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
                                                                ? "bg-white text-brand-orange border-brand-orange"
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
                        <div className="flex items-center border-2 border-gray-200 rounded-full w-fit mb-6">
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
                                onClick={() => setQuantity((prev) => prev + 1)}
                                className="w-10 h-10 flex items-center justify-center font-body text-lg cursor-pointer"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">

                            <button
                                onClick={buyNow}
                                className="flex-1 border-2 border-black text-black font-heading text-base py-3 rounded-full hover:bg-black hover:text-white transition cursor-pointer"
                            >
                                BUY NOW
                            </button>

                            <button
                                onClick={addToCart}
                                className="flex-1 bg-brand-orange text-white font-heading text-base py-3 rounded-full shadow-md hover:-translate-y-1 transition cursor-pointer"
                            >
                                ADD TO CART
                            </button>

                        </div>

                    </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 text-center">
                    <div className="flex flex-col items-center">
                        <Truck size={32} strokeWidth={1.5} className="text-brand-orange mb-3" />
                        <h4 className="font-body font-semibold text-sm mb-1">
                            Fast Delivery
                        </h4>
                        <p className="font-body text-xs text-gray-500">
                            Delivered within 3-5 business days
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <RotateCcw size={32} strokeWidth={1.5} className="text-brand-orange mb-3" />
                        <h4 className="font-body font-semibold text-sm mb-1">
                            Easy Returns
                        </h4>
                        <p className="font-body text-xs text-gray-500">
                            Hassle-free returns within 7 days
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <Lock size={32} strokeWidth={1.5} className="text-brand-orange mb-3" />
                        <h4 className="font-body font-semibold text-sm mb-1">
                            Secure Checkout
                        </h4>
                        <p className="font-body text-xs text-gray-500">
                            Your payments are protected and encrypted
                        </p>
                    </div>
                </div>

                {showViewCart && (
                    <div className="fixed bottom-0 left-0 w-full bg-green-600 text-white p-4 flex justify-between items-center shadow-lg">
                        <span>Item added to cart</span>

                        <button
                            onClick={() => navigate("/cart")}
                            className="bg-white text-green-600 px-4 py-2 rounded"
                        >
                            View Cart
                        </button>
                    </div>
                )}

            </div>
            {product.howToEnjoy?.length > 0 && (
  <section className="my-16">
    <h2 className="text-3xl font-heading mb-8">
      How To Enjoy
    </h2>

    <div className="grid md:grid-cols-3 gap-6">
      {product.howToEnjoy.map((item, index) => {
        const Icon = iconMap[item.icon];

        return (
          <div
            key={index}
            className="border rounded-xl p-6 text-center"
          >
            {Icon && (
              <Icon className="w-10 h-10 mx-auto mb-4" />
            )}

            <h3 className="font-bold text-lg mb-2">
              {item.title}
            </h3>

            <p className="text-gray-600">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  </section>
)}
            <div className="mt-16 border-t pt-10">
                <h2 className="text-3xl font-bold mb-8">
                    Customer Reviews
                </h2>
                {/* Average Rating */}
                <div className="bg-gray-50 p-6 rounded-xl mb-8 flex items-center gap-8">
                    <div>
                        <h3 className="text-5xl font-bold">
                            {averageRating}
                        </h3>

                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={24}
                                    className={`${star <= Math.round(averageRating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-lg font-medium">
                            {reviews.length} Customer Review
                            {reviews.length !== 1 && "s"}
                        </p>

                        <p className="text-gray-500">
                            Verified buyers and customers share their experiences.
                        </p>
                    </div>
                </div>

                {/* Write Review Button */}
                <div className="mb-8">
                    <button
                        onClick={handleWriteReview}
                        className="bg-black text-white px-6 py-3 rounded-lg"
                    >
                        Write a Review
                    </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                    <div className="bg-gray-50 p-6 rounded-xl mb-10">

                        <h3 className="text-xl font-semibold mb-4">
                            Write a Review
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
                            className="w-full border p-3 rounded mb-4"
                            rows="4"
                        />

                        <div className="flex gap-4">
                            <button
                                onClick={submitReview}
                                className="bg-black text-white px-6 py-2 rounded"
                            >
                                Submit Review
                            </button>

                            <button
                                onClick={() => setShowReviewForm(false)}
                                className="border px-6 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Reviews List */}
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div
                                key={review._id}
                                className="border rounded-xl p-5"
                            >
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-semibold">
                                        {review.user?.name}
                                    </h4>

                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={18}
                                                className={`${star <= review.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-gray-700">
                                    {review.comments}
                                </p>

                                <p className="text-sm text-gray-500 mt-2">
                                    {new Date(
                                        review.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

            </div>
            <FeaturedProducts
                excludeProductId={product._id}
                heading="EXPLORE SIMILAR PRODUCTS"
                subheading="Discover more delicious options you'll love."
            />
            <FAQSection faqs={product.faqs} image={product.image}/>
            <Footer />
        </>
    );
}