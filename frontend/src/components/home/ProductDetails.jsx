import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
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

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/product/${id}`);
            console.log(res);
            setProduct(res.data);
            setSelectedImage(res.data.image);
            setSelectedPack(res.data.packSizes?.[0]);
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
            <div className="max-w-7xl mx-auto px-6 py-10">

                <div className="grid md:grid-cols-2 gap-12">

                    {/* LEFT SIDE - IMAGES */}
                    <div>

                        <div className="border rounded-xl overflow-hidden">
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-[500px] object-cover"
                            />
                        </div>

                        <div className="flex gap-3 mt-4">
                            {allImages.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`thumbnail-${index}`}
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${selectedImage === img
                                            ? "border-black"
                                            : "border-gray-200"
                                        }`}
                                />
                            ))}
                        </div>

                    </div>

                    {/* RIGHT SIDE - PRODUCT INFO */}
                    <div>

                        <p className="text-sm text-gray-500 mb-2">
                            {product.category?.name}
                        </p>

                        <h1 className="text-4xl font-bold mb-4">
                            {product.name}
                        </h1>

                        <p className="text-3xl font-semibold mb-6">
                            {/* ₹{product.price} */}
                            ₹{selectedPack?.price || product.packSizes?.[0]?.price}
                        </p>

                        <p className="text-gray-600 mb-8">
                            {product.description}
                        </p>
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
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">
                                Select Your Pack Size
                            </h3>

                            <div className="flex gap-3">
                                
                                
                                {/* Add this above the pack buttons */}
{(() => {
    // base unit price = smallest pack's price per unit
    const baseUnitPrice = product.packSizes?.[0]?.price / product.packSizes?.[0]?.units;

    return (
        <div className="flex gap-3 flex-wrap">
            {product.packSizes?.map((pack) => {
                const fullPrice = baseUnitPrice * pack.units;
                const savings = Math.round(((fullPrice - pack.price) / fullPrice) * 100);
                const hasSavings = savings > 0;

                return (
                    <button
                        key={pack._id}
                        onClick={() => setSelectedPack(pack)}
                        className={`flex flex-col items-center px-5 py-2 rounded-full border transition ${
                            selectedPack?.units === pack.units
                                ? "bg-black text-white"
                                : "hover:bg-black hover:text-white"
                        }`}
                    >
                        <span>{pack.label}</span>
                        {hasSavings && (
                            <span className={`text-xs font-semibold mt-0.5 ${
                                selectedPack?.units === pack.units
                                    ? "text-green-300"
                                    : "text-green-600"
                            }`}>
                                Save {savings}%
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
})()}
                            </div>
                        </div>
                        {/* Quantity */}
                        <div className="flex items-center gap-4 mb-6">

                            <button
                                onClick={() =>
                                    setQuantity((prev) =>
                                        prev > 1 ? prev - 1 : 1
                                    )
                                }
                                className="px-4 py-2 border rounded"
                            >
                                -
                            </button>

                            {/* <span className="text-lg font-medium">
                            {quantity}
                        </span> */}
                            <div className="text-lg font-medium">
                                {quantity} Pack{quantity > 1 ? "s" : ""}
                                <div className="text-sm text-gray-500">
                                    ({quantity * selectedPack} packets)
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    setQuantity((prev) => prev + 1)
                                }
                                className="px-4 py-2 border rounded"
                            >
                                +
                            </button>

                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 mb-8">

                            <button
                                onClick={addToCart}
                                className="flex-1 bg-black text-white py-3 rounded-lg"
                            >
                                Add To Cart
                            </button>

                            <button
                                onClick={buyNow}
                                className="flex-1 border border-black py-3 rounded-lg"
                            >
                                Buy Now
                            </button>

                        </div>

                        {/* Trust Badges */}
                        <div className="space-y-4 border-t pt-6">

                            <div>
                                <h3 className="font-semibold">
                                    🚚 Fast Delivery
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Delivered within 3-5 business days.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    ↩️ Easy Returns
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Hassle-free returns within 7 days.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    🔒 Secure Checkout
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Your payments are protected and encrypted.
                                </p>
                            </div>

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
                ```

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