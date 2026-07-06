// src/components/Navbar.jsx

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Home, LayoutGrid, PackageOpen, Info, LogIn, UserPlus, LogOut, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import api from "../api/axios"; 
import PromoBar from "./home/PromoBar";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();

const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => setIsScrolled(window.scrollY > 10);
  window.addEventListener("scroll", handleScroll);
  handleScroll(); 
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  const fetchProducts = async () => {
  try {
    const res = await api.get("/product");
    console.log(res);
    setProducts(res.data);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
    if (showSearch && products.length === 0) {
        fetchProducts();
    }
}, [showSearch]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const saved = localStorage.getItem("cartItems");
      const items = saved ? JSON.parse(saved) : [];
      setCartCount(items.length);
    };
    updateCount();
    window.addEventListener("cartUpdated", updateCount);
    return () => window.removeEventListener("cartUpdated", updateCount);
  }, []);
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5));
  }, [search, products]);

    const [showLoginToast, setShowLoginToast] = useState(false);

  useEffect(() => {
    if (!showLoginToast) return;
    const t = setTimeout(() => setShowLoginToast(false), 3000);
    return () => clearTimeout(t);
  }, [showLoginToast]);

  const token = localStorage.getItem("token");
  const { openCart } = useCart();

  return (
    <>
    <PromoBar />
    <header
  className={`fixed top-0 left-0 right-0 z-20 px-4 sm:px-6 transition-all duration-300 ${
    isScrolled ? "py-3" : "py-15"
  }`}
>
      <nav className="max-w-7xl mx-auto flex items-center justify-between bg-white rounded-full px-8 sm:px-10 py-1.5 shadow-sm">
        {/* Logo */}
        <div
          className="font-heading text-2xl cursor-pointer select-none leading-none"
          onClick={() => navigate("/")}
        >

          <img src="/images/oats-crush.webp" className="w-19 h-13"/>

        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-15 font-body text-sm font-medium">
          <Link to="/" className="hover:text-brand-orange-dark transition">
            Home
          </Link>

<Link to="/products" className="hover:text-brand-orange-dark transition">
  Shop Now
</Link>

          <Link to="/customize-box" className="hover:text-brand-orange-dark transition">
  Customize Box
</Link>

<Link to="/about-us" className="hover:text-brand-orange-dark transition">
  About Us
</Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
  className="hidden sm:flex items-center cursor-pointer hover:text-brand-orange"
  aria-label="Search"
  onClick={() => setShowSearch(true)}
>
  <Search size={20} />
</button>
         <button
  className="relative flex cursor-pointer hover:text-brand-orange"
  aria-label="Cart"
  onClick={() => {
    if (!token) {
      setShowLoginToast(true);
     return;
    }
    openCart();
  }}
>
  <ShoppingBag size={20} />
  {cartCount > 0 && (
    <span className="absolute -bottom-1.5 -right-1.5 bg-brand-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
      {cartCount > 9 ? "9+" : cartCount}
    </span>
  )}
</button>

          {!token ? (
  <button
    className="hidden sm:flex cursor-pointer hover:text-brand-orange"
    aria-label="Account"
    onClick={() => navigate("/signup")}
  >
    <User size={20} />
  </button>
) : (
<div className="relative hidden sm:flex items-center">
    <button
      className="flex items-center cursor-pointer hover:text-brand-orange"
      aria-label="Account"
      onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
    >
      <User size={20} />
    </button>

              {isAccountMenuOpen && (
  <div className="absolute top-8 right-0 bg-white border rounded-xl shadow-md min-w-[180px] py-2 z-50 text-sm cursor-pointer">
    <button
      className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer hover:text-brand-orange"
      onClick={() => {
        navigate("/profile");
        setIsAccountMenuOpen(false);
      }}
    >
      View Profile
    </button>
    <button
      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer hover:text-brand-orange"
      onClick={() => {
        localStorage.removeItem("token");
        navigate("/");
        setIsAccountMenuOpen(false);
      }}
    >
      Logout
    </button>
  </div>
)}
            </div>
          )}
<button
  className="sm:hidden flex items-center cursor-pointer hover:text-brand-orange"
  aria-label="Search"
  onClick={() => setShowSearch(true)}
>
  <Search size={20} />
</button>
          {/* Mobile hamburger */}
          <button
            className="md:hidden flex cursor-pointer"
            aria-label="Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

{/* Mobile drawer overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 z-[95] bg-black/40 backdrop-blur-sm"
        />
      )}

      {/* Mobile drawer panel */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[100] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <img src="/images/oats-crush.webp" className="w-16 h-11" alt="Oats Crush" />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            className="cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-6 py-4 font-body">
          {[
            { to: "/", label: "Home", icon: Home },
            { to: "/products", label: "Shop Now", icon: LayoutGrid },
            { to: "/customize-box", label: "Customize Box", icon: PackageOpen },
            { to: "/about-us", label: "About Us", icon: Info },
          ].map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-4 border-b border-gray-100 group"
            >
              <span className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center flex-shrink-0 group-hover:bg-brand-orange group-hover:text-white transition">
                  <Icon size={16} />
                </span>
                <span className="text-base">{label}</span>
              </span>
              <ChevronRight size={16} className="text-gray-300" />
            </Link>
          ))}
        </nav>

        {/* Footer - auth actions */}
        <div className="px-6 py-6 border-t border-gray-100 flex-shrink-0">
          {!token ? (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigate("/login");
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-brand-orange text-brand-orange font-heading text-sm py-3 rounded-full cursor-pointer"
              >
                <LogIn size={16} /> LOGIN
              </button>
              <button
                onClick={() => {
                  navigate("/signup");
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-orange text-white font-heading text-sm py-3 rounded-full cursor-pointer"
              >
                <UserPlus size={16} /> SIGNUP
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  navigate("/profile");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 bg-brand-orange text-white font-heading text-sm py-3 rounded-full cursor-pointer"
              >
                <User size={16} /> VIEW PROFILE
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 font-heading text-sm py-3 rounded-full cursor-pointer"
              >
                <LogOut size={16} /> LOGOUT
              </button>
            </div>
          )}
        </div>
      </div>
{/* Search overlay - styled like the header pill, works at all breakpoints */}
{showSearch && (
  <>
    {/* Backdrop blur over the rest of the page */}
    <div
      className="fixed inset-0 z-[90] bg-black/10 backdrop-blur-sm"
      onClick={() => {
        setShowSearch(false);
        setSearch("");
        setSuggestions([]);
      }}
    />

    {/* Search pill sitting in the same spot/shape as the header nav */}
    <div className="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-6 py-15 pointer-events-none">
      <div className="max-w-7xl mx-auto bg-white rounded-full px-6 sm:px-10 py-1.5 shadow-lg flex items-center gap-3 pointer-events-auto">
        <Search size={18} className="text-gray-400 flex-shrink-0" />

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 py-2.5 outline-none bg-transparent text-sm"
          autoFocus
        />

        <button
          aria-label="Close search"
          onClick={() => {
            setShowSearch(false);
            setSearch("");
            setSuggestions([]);
          }}
          className="cursor-pointer flex-shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      {/* Suggestions dropdown below the pill */}
      {search && (
        <div className="max-w-7xl mx-auto mt-2 bg-white rounded-2xl shadow-lg overflow-hidden pointer-events-auto">
          {suggestions.length > 0 ? (
            suggestions.map((product) => (
              <div
                key={product._id}
                className="px-5 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer text-sm"
                onClick={() => {
                  navigate(`/product/${product._id}`);
                  setSearch("");
                  setSuggestions([]);
                  setShowSearch(false);
                }}
              >
                {product.name}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 px-5 py-3">No products found</p>
          )}
        </div>
      )}
    </div>
  </>
)}

    </header>
    {showLoginToast && (
  <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] bg-white border border-gray-200 rounded-2xl shadow-xl px-6 py-4 flex items-center gap-4 min-w-[280px]">
    <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
    <p className="font-body text-sm text-black flex-1">
      Please log in to view your cart
    </p>
    <button
      onClick={() => { setShowLoginToast(false); navigate("/login"); }}
      className="bg-brand-orange text-white font-heading text-xs px-4 py-1.5 rounded-full hover:-translate-y-0.5 transition cursor-pointer"
    >
      LOG IN
    </button>
    <button
      onClick={() => setShowLoginToast(false)}
      className="text-gray-400 hover:text-black text-lg leading-none cursor-pointer"
    >
      ×
    </button>
  </div>
)}
    </>
  );
};

export default Navbar;