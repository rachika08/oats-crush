import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Star, ChevronDown, SlidersHorizontal, X, ChevronRight } from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import InfoBar from "../components/home/InfoBar";
import CartToast from "../components/CartToast";
import PageFade from "../components/PageFade";
import { getStrikethroughPrice } from "../utils/pricing";
import { motion, AnimatePresence } from "framer-motion";


const PRODUCTS_PER_PAGE = 6;


const FilterDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isSelected = Boolean(value);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 border rounded-full px-4 py-2 font-body text-sm shadow-sm transition-colors duration-200 cursor-pointer ${isSelected
          ? "bg-brand-orange border-brand-orange text-white"
          : "border-brand-orange text-black"
          }`}
      >
        {value || label}

        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ transformOrigin: "top left" }}
            className="absolute top-11 left-0 bg-white rounded-2xl shadow-lg min-w-[170px] p-2 z-20 font-body text-sm"
          >
            <div className="absolute -top-1 left-6 w-3 h-3 bg-white rotate-45" />

            {isSelected && (
              <>
                <button
                  onClick={() => {
                    onChange("");
                    setIsOpen(false);
                  }}
                  className="relative w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-red-50 transition text-red-500 cursor-pointer"
                >
                  <X size={14} />
                  Clear
                </button>
                <div className="h-px bg-gray-100 mx-1.5 my-1" />
              </>
            )}

            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`relative w-full text-left px-3 py-2 rounded-lg transition cursor-pointer ${
                  value === option
                    ? "bg-brand-orange/10 text-brand-orange-dark font-medium"
                    : "hover:bg-brand-orange/10"
                }`}
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");
  const [price, setPrice] = useState("");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [notifyStatus, setNotifyStatus] = useState({});
  const [cartStatus, setCartStatus] = useState({});

    // ---------------- MOBILE FILTER DRAWER ----------------
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState(null); // "category" | "availability" | "price" | "sort" | null
  const [tempCategory, setTempCategory] = useState("");
  const [tempAvailability, setTempAvailability] = useState("");
  const [tempPrice, setTempPrice] = useState("");
  const [tempSortBy, setTempSortBy] = useState("Most Popular");

  const openMobileFilters = () => {
    setTempCategory(category);
    setTempAvailability(availability);
    setTempPrice(price);
    setTempSortBy(sortBy);
    setExpandedFilter(null);
    setIsMobileFilterOpen(true);
  };

  const applyMobileFilters = () => {
    setCategory(tempCategory);
    setAvailability(tempAvailability);
    setPrice(tempPrice);
    setSortBy(tempSortBy);
    setCurrentPage(1);
    setIsMobileFilterOpen(false);
  };

  const removeAllMobileFilters = () => {
    setTempCategory("");
    setTempAvailability("");
    setTempPrice("");
    setTempSortBy("Most Popular");
  };
  // let filteredProducts = [...products];
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/product");
      const allProducts = res.data.products || res.data;
      setProducts(allProducts);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category");
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

const handleAddToCart = async (e, product) => {
    e.stopPropagation();

    if (cartStatus[product._id] === "loading") return;

    try {
      const token = localStorage.getItem("token");

if (!token) {
        setToast({ show: true, message: "Please login to add items to your cart", variant: "info" });
        setTimeout(() => navigate("/login"), 800);
        return;
      }

      const defaultPack =
        product.packSizes?.find((p) => Number(p.units) === 1) ||
        product.packSizes?.[0];

      if (!defaultPack) {
        setToast({ show: true, message: "Product pack missing", variant: "info" });
        return;
      }

      const price = Number(defaultPack.price);

      if (isNaN(price)) {
        setToast({ show: true, message: "Invalid product price", variant: "info" });
        return;
      }
      setCartStatus((prev) => ({ ...prev, [product._id]: "loading" }));

      const res = await api.post(
        "/cart/add",
        {
          productId: product._id,
          quantity: 1,
          pack: {
            label: defaultPack.label,
            units: Number(defaultPack.units) || 1,
            price: price,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedItems = res.data.items || [];
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      localStorage.setItem("cartCount", updatedItems.length);

      window.dispatchEvent(new Event("cartUpdated"));

setCartStatus((prev) => ({ ...prev, [product._id]: "success" }));
      setToast({ show: true, message: "Added to cart successfully!", variant: "success" });

      setTimeout(() => {
        setCartStatus((prev) => ({ ...prev, [product._id]: "idle" }));
      }, 2000);
    } catch (error) {
      console.log(error.response?.data || error.message);
      setCartStatus((prev) => ({ ...prev, [product._id]: "idle" }));
    }
  };

  const handleNotify = async (e, product) => {
    e.stopPropagation();

    const productId = product._id;

    if (notifyStatus[productId] === "loading") {
      return;
    }

    const token = localStorage.getItem("token");

if (!token) {
      setToast({ show: true, message: "Please login to get notified", variant: "info" });
      setTimeout(() => navigate("/login"), 800);
      return;
    }

    setNotifyStatus((prev) => ({ ...prev, [productId]: "loading" }));

    try {
      await api.post(
        "/notification/notify",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifyStatus((prev) => ({ ...prev, [productId]: "success" }));
    } catch (error) {
      console.log(error.response?.data || error.message);

      if (error.response?.data?.message === "Already subscribed") {
        setNotifyStatus((prev) => ({ ...prev, [productId]: "success" }));
        return;
      }

setNotifyStatus((prev) => ({ ...prev, [productId]: "idle" }));
      setToast({ show: true, message: error.response?.data?.message || "Something went wrong", variant: "info" });
    }
  };
  const filteredProducts = products
    .filter((product) => {
      if (!category) return true;
      return product.category?.name?.toLowerCase() === category.toLowerCase();
    })
    .filter((product) => {
      if (availability === "In Stock") return product.stock > 0;
      if (availability === "Sold Out") return product.stock <= 0;
      return true;
    })
    .filter((product) => {
      const basePrice =
        product.packSizes?.find((p) => p.units === 1)?.price || 0;

      if (price === "Under ₹150") return basePrice < 150;
      if (price === "₹150 - ₹300") return basePrice >= 150 && basePrice <= 300;
      if (price === "₹300+") return basePrice > 300;

      return true;
    })
    .sort((a, b) => {
      const getPrice = (p) =>
        p.packSizes?.find((x) => x.units === 1)?.price || 0;

      if (sortBy === "Price: Low to High") return getPrice(a) - getPrice(b);
      if (sortBy === "Price: High to Low") return getPrice(b) - getPrice(a);
      if (sortBy === "Newest")
        return new Date(b.createdAt) - new Date(a.createdAt);

      return 0;
    });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const similarProducts = products.slice(0, 3);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

const ProductCardItem = ({ product }) => {
    const isComingSoon = product.isLaunched === false;
    const isSoldOut = !isComingSoon && product.stock <= 0;
    const isUnavailable = isComingSoon || isSoldOut;
    const status = notifyStatus[product._id];
    const cartState = cartStatus[product._id];


    return (
<div
        onClick={() => navigate(`/product/${product._id}`)}
        className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition"
      >
<div className="relative aspect-square m-2 sm:m-3 rounded-lg sm:rounded-xl overflow-hidden">
          {isComingSoon && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white text-brand-orange-dark text-[10px] sm:text-xs font-body font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
              Coming Soon
            </span>
          )}
          {isSoldOut && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white text-black text-[10px] sm:text-xs font-body font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
              Sold Out
            </span>
          )}

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

<div className="px-3 pb-3 sm:px-4 sm:pb-4">
          {product.reviewCount > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-white shadow-sm border border-gray-100 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 mb-2">
              <Star size={12} className="fill-brand-orange text-brand-orange sm:w-3.5 sm:h-3.5" />
              <span className="font-body text-xs sm:text-sm font-semibold text-black">
                {product.averageRating}
              </span>
              <span className="font-body text-xs sm:text-sm text-gray-300">|</span>
              <span className="font-body text-xs sm:text-sm text-gray-500">
                {product.reviewCount} Reviews
              </span>
            </div>
          )}

          <h3 className="font-heading text-lg sm:text-2xl mb-1 uppercase line-clamp-1">
            {product.name}
          </h3>

          <p className="font-body text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 line-clamp-1">
            {product.benefits?.slice(0, 2).join(" • ") ||
              product.category?.name}
          </p>

          {(() => {
            const price = product.packSizes?.find(p => p.units === 1)?.price;
            const strike = getStrikethroughPrice(product, price);

            return (
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
                <p className="font-heading text-lg sm:text-2xl">
                  ₹{price ?? "N/A"}
                </p>
                {strike && (
                  <>
                    <span className="font-heading text-lg sm:text-2xl text-gray-400 line-through">
                      ₹{strike.original}
                    </span>
                    <span className="bg-green-100 text-green-700 text-[10px] sm:text-xs font-body font-semibold px-2 py-0.5 rounded-full">
                      {strike.discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
            );
          })()}

<button
  onClick={(e) =>
    isUnavailable ? handleNotify(e, product) : handleAddToCart(e, product)
  }
  disabled={
    isUnavailable
      ? status === "loading" || status === "success"
      : cartState === "loading"
  }
  className={`w-full rounded-full py-2.5 font-heading text-lg font-medium transition flex items-center justify-center gap-2 border-2 ${isUnavailable
    ? "bg-gray-500 text-white cursor-pointer disabled:cursor-default"
    : "bg-brand-orange text-white border-transparent hover:border-brand-orange hover:bg-white hover:text-brand-orange hover:-translate-y-1 shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-default"
    }`}
>
  {isUnavailable ? (
    status === "success" ? (
      "SUBSCRIBED ✓"
    ) : status === "loading" ? (
      "SENDING..."
    ) : (
      <>
        NOTIFY <Bell size={14} />
      </>
    )
  ) : cartState === "success" ? (
    "ADDED ✓"
  ) : cartState === "loading" ? (
    "ADDING..."
  ) : (
    "ADD TO CART"
  )}
</button>
        </div>
      </div>
    );
  };

  return (
    <PageFade>
    <>
      {/* Hero banner */}
      <section className="relative">
        <Navbar />

        <div className="relative h-[320px] sm:h-[480px] overflow-hidden">
          <img
            src="/images/banner4.webp"
            alt="Crush Every Craving"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative h-full flex flex-col justify-center px-6 sm:px-10 pt-16 sm:pt-20 max-w-7xl mx-auto">
            <span className="inline-block bg-white text-black rounded-full px-4 py-1 text-xs font-body border border-brand-orange mb-4 w-fit">
              Our Collection
            </span>

            <h1 className="font-heading text-white text-4xl sm:text-5xl leading-tight">
              CRUSH EVERY
              <br />
              <span className="text-brand-orange">CRAVING</span>
            </h1>

            <p className="font-body text-white/90 text-sm sm:text-base mt-3">
              Pick your flavour. Same protein punch, different vibe.
            </p>
          </div>
        </div>
      </section>

      {/* Info marquee */}
      <InfoBar />

{/* Filter / Sort bar — desktop */}
      <div className="hidden sm:flex max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-wrap items-center justify-between gap-4 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-body text-sm text-gray-600 mr-1">
            Filter By
          </span>

          <FilterDropdown
            label="Availability"
            value={availability}
            onChange={setAvailability}
            options={["In Stock", "Sold Out"]}
          />

          <FilterDropdown
            label="Price"
            value={price}
            onChange={setPrice}
            options={["Under ₹150", "₹150 - ₹300", "₹300+"]}
          />
          {(category || availability || price) && (
            <button
              onClick={() => {
                setCategory("");
                setAvailability("");
                setPrice("");
                setCurrentPage(1);
              }}
              className="text-xs font-body text-red-400 underline cursor-pointer hover:text-red-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-body text-sm text-gray-600">Sort By</span>

          <FilterDropdown
            label="Most Popular"
            value={sortBy}
            onChange={setSortBy}
            options={["Most Popular", "Price: Low to High", "Price: High to Low", "Newest"]}
          />
        </div>
      </div>

      {/* Filter / Sort bar — mobile */}
      <button
        onClick={openMobileFilters}
        className="sm:hidden w-full flex items-center justify-between px-4 py-4 border-b border-gray-100"
      >
        <span className="flex items-center gap-2 font-body text-sm text-black">
          <SlidersHorizontal size={16} />
          Filter and sort
        </span>
        <span className="font-body text-sm text-gray-500">
          {filteredProducts.length} products
        </span>
      </button>

      {/* Mobile filter drawer */}
      {isMobileFilterOpen && (
        <>
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 z-[80] bg-black/40 sm:hidden"
          />

          <div className="fixed bottom-0 left-0 right-0 z-[90] bg-white rounded-t-2xl sm:hidden flex flex-col max-h-[85vh]">
            <div className="flex flex-col items-center pt-5 pb-4 border-b border-gray-100 relative flex-shrink-0">
              <h2 className="font-heading text-base uppercase">Filter and sort</h2>
              <p className="font-body text-xs text-gray-500 mt-1">
                {filteredProducts.length} products
              </p>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="absolute right-5 top-5"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">


              {/* Availability */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() =>
                    setExpandedFilter(expandedFilter === "availability" ? null : "availability")
                  }
                  className="w-full flex items-center justify-between px-5 py-4"
                >
                  <span className="font-body text-sm">
                    Availability {tempAvailability && <span className="text-brand-orange">· {tempAvailability}</span>}
                  </span>
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform ${
                      expandedFilter === "availability" ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedFilter === "availability" && (
                  <div className="px-5 pb-4 flex flex-wrap gap-2">
                    {["In Stock", "Sold Out"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() =>
                          setTempAvailability(tempAvailability === opt ? "" : opt)
                        }
                        className={`px-4 py-2 rounded-full text-sm border ${
                          tempAvailability === opt
                            ? "bg-brand-orange text-white border-brand-orange"
                            : "border-gray-200 text-black"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() =>
                    setExpandedFilter(expandedFilter === "price" ? null : "price")
                  }
                  className="w-full flex items-center justify-between px-5 py-4"
                >
                  <span className="font-body text-sm">
                    Price {tempPrice && <span className="text-brand-orange">· {tempPrice}</span>}
                  </span>
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform ${
                      expandedFilter === "price" ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedFilter === "price" && (
                  <div className="px-5 pb-4 flex flex-wrap gap-2">
                    {["Under ₹150", "₹150 - ₹300", "₹300+"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setTempPrice(tempPrice === opt ? "" : opt)}
                        className={`px-4 py-2 rounded-full text-sm border ${
                          tempPrice === opt
                            ? "bg-brand-orange text-white border-brand-orange"
                            : "border-gray-200 text-black"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort by */}
              <div>
                <button
                  onClick={() =>
                    setExpandedFilter(expandedFilter === "sort" ? null : "sort")
                  }
                  className="w-full flex items-center justify-between px-5 py-4"
                >
                  <span className="font-body text-sm">Sort by:</span>
                  <span className="flex items-center gap-1 font-body text-sm text-gray-600">
                    {tempSortBy}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        expandedFilter === "sort" ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>
                {expandedFilter === "sort" && (
                  <div className="px-5 pb-4 flex flex-col gap-2">
                    {["Most Popular", "Price: Low to High", "Price: High to Low", "Newest"].map(
                      (opt) => (
                        <button
                          key={opt}
                          onClick={() => setTempSortBy(opt)}
                          className={`text-left px-4 py-2 rounded-full text-sm border ${
                            tempSortBy === opt
                              ? "bg-brand-orange text-white border-brand-orange"
                              : "border-gray-200 text-black"
                          }`}
                        >
                          {opt}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={removeAllMobileFilters}
                className="font-body text-sm underline"
              >
                Remove all
              </button>
              <button
                onClick={applyMobileFilters}
                className="bg-brand-orange text-white font-heading text-l px-8 py-3 rounded-full"
              >
                APPLY
              </button>
            </div>
          </div>
        </>
      )}

      {/* Product grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <p className="font-body text-sm text-gray-600 mb-6">
          Showing {paginatedProducts.length} of {filteredProducts.length} products
        </p>

        {paginatedProducts.length === 0 ? (
          <p className="text-center font-body text-gray-500 py-10">
            No products available
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {paginatedProducts.map((product) => (
              <ProductCardItem key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-full flex items-center justify-center text-brand-orange disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous page"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-9 h-9 rounded-full font-body text-sm font-medium transition cursor-pointer ${page === currentPage
                    ? "bg-brand-orange text-white"
                    : "text-black hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-full flex items-center justify-center text-brand-orange disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        )}
      </section>

      <Footer />
            <CartToast
        show={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        message={toast.message}
        variant={toast.variant}
      />
    </>
    </PageFade>
  );
};

export default AllProducts;