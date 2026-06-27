import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import InfoBar from "../components/home/InfoBar";

const PRODUCTS_PER_PAGE = 6;

const FilterDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isSelected = Boolean(value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 border rounded-full px-4 py-2 font-body text-sm shadow-sm transition-colors duration-200 cursor-pointer ${
          isSelected
            ? "bg-brand-orange border-brand-orange text-white"
            : "border-brand-orange text-black"
        }`}
      >
        {value || label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-10 left-0 bg-white border border-brand-orange rounded-xl shadow-md min-w-[160px] py-2 z-20 text-sm">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-brand-orange transition-colors duration-150 cursor-pointer"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");
  const [price, setPrice] = useState("");
  const [sortBy, setSortBy] = useState("Most Popular");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
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

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add items to your cart");
        navigate("/login");
        return;
      }

      await api.post(
        "/cart/add",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Added to cart!");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(products.length / PRODUCTS_PER_PAGE)
  );

  const paginatedProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const similarProducts = products.slice(0, 3);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const ProductCardItem = ({ product }) => {
    const isSoldOut = product.stock <= 0;

    return (
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition"
      >
        <div className="relative aspect-square m-3 rounded-xl overflow-hidden">
          {isSoldOut && (
            <span className="absolute top-3 left-3 bg-white text-black text-xs font-body font-medium px-3 py-1 rounded-full">
              Sold Out
            </span>
          )}

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="px-4 pb-4">
          <h3 className="font-heading text-lg sm:text-lg mb-1 uppercase">
            {product.name}
          </h3>

          <p className="font-body text-sm text-gray-500 mb-3">
            {product.benefits?.slice(0, 2).join(" • ") ||
              product.category?.name}
          </p>

          <p className="font-heading text-xl mb-3">
            ₹{product.price}.00
          </p>

          <button
            onClick={(e) =>
              isSoldOut ? e.stopPropagation() : handleAddToCart(e, product)
            }
            disabled={isSoldOut}
            className={`w-full rounded-full py-2.5 font-heading text-lg font-medium transition flex items-center justify-center gap-2 border-2 ${
              isSoldOut
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-brand-orange text-white border-transparent hover:border-brand-orange hover:bg-white hover:text-brand-orange hover:-translate-y-1 shadow-md cursor-pointer"
            }`}
          >
            {isSoldOut ? (
                            <>
                              NOTIFY WHEN BACK <Bell size={14} />
                            </>
                          ) : (
                            "ADD TO CART"
                          )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Hero banner */}
      <section className="relative">
        <Navbar />

        <div className="relative h-[320px] sm:h-[480px] overflow-hidden">
          <img
            src="/images/banner4.jpg"
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

      {/* Filter / Sort bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-body text-sm text-gray-600 mr-1">
            Filter By
          </span>

          <FilterDropdown
            label="Category"
            value={category}
            onChange={setCategory}
            options={["Coffee", "Rasmalai", "Savoury", "Midnight Latte"]}
          />

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

      {/* Product grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <p className="font-body text-sm text-gray-600 mb-6">
          Showing {paginatedProducts.length} of {products.length} products
        </p>

        {paginatedProducts.length === 0 ? (
          <p className="text-center font-body text-gray-500 py-10">
            No products available
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                  className={`w-9 h-9 rounded-full font-body text-sm font-medium transition cursor-pointer ${
                    page === currentPage
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

      {/* Explore Similar Products */}
      {similarProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="font-heading text-3xl sm:text-4xl mb-8">
            EXPLORE SIMILAR PRODUCTS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {similarProducts.map((product) => (
              <ProductCardItem key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </>
  );
};

export default AllProducts;