import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../Navbar";
import Footer from "./Footer";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate=useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [showViewCart, setShowViewCart] = useState(false);
    
    useEffect(() => {
        fetchProduct();
        
    }, [id]);
    useEffect(() => {
        if (product) {
            fetchCartQuantity();
        }
    }, [product]);
    const addToCart = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await api.post(
                "/cart/add",
                {
                    productId: product._id,
                    quantity: quantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setShowViewCart(true);
            console.log("Cart updated:", res.data);
            alert("Added to cart!");
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/product/${id}`);

            setProduct(res.data);
            setSelectedImage(res.data.image);
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

   
    
    return (
        <><Navbar/>
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
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                                    selectedImage === img
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
                        ₹{product.price}
                    </p>

                    <p className="text-gray-600 mb-8">
                        {product.description}
                    </p>

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

                        <span className="text-lg font-medium">
                            {quantity}
                        </span>

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
        <Footer/>
        </>
    );
}