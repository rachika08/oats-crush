// src/components/Navbar.jsx

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import api from "../api/axios"; 

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category");
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const token = localStorage.getItem("token");

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-6 py-15">
      <nav className="max-w-7xl mx-auto flex items-center justify-between bg-white rounded-full px-8 sm:px-10 py-1.5 shadow-sm">
        {/* Logo */}
        <div
          className="font-heading text-2xl cursor-pointer select-none leading-none"
          onClick={() => navigate("/")}
        >
          <img src="/src/assets/images/oats-crush-logo.jpeg" className="w-23 h-15"/>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-15 font-body text-sm font-medium">
          <Link to="/" className="hover:text-brand-orange transition">
            Home
          </Link>

          {/* Category Dropdown */}
          <div className="relative">
            <button
  className="flex items-center gap-1 hover:text-brand-orange transition cursor-pointer"
  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
>
  Categories
  <ChevronDown
    size={14}
    className={`transition-transform duration-200 ${
      isCategoryOpen ? "rotate-180" : ""
    }`}
  />
</button>

            {isCategoryOpen && (
              <div className="absolute top-8 left-0 bg-white border rounded-xl shadow-md min-w-[200px] py-2 z-50">
                {categories.length === 0 ? (
                  <div className="px-4 py-2 text-gray-400 text-sm">
                    No categories yet
                  </div>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category._id}
                      onClick={() => {
                        navigate(`/category/${category._id}`);
                        setIsCategoryOpen(false);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                    >
                      {category.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <Link to="/contact" className="hover:text-brand-orange transition">
            About Us
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button className="hidden sm:flex cursor-pointer" aria-label="Search">
            <Search size={20} />
          </button>

          <button
            className="flex cursor-pointer"
            aria-label="Cart"
            onClick={() => navigate("/cart")}
          >
            <ShoppingBag size={20} />
          </button>

          {!token ? (
            <button
              className="hidden sm:flex cursor-pointer"
              aria-label="Account"
              onClick={() => navigate("/login")}
            >
              <User size={20} />
            </button>
          ) : (
            <div className="relative hidden sm:block cursor-pointer">
              <button
                aria-label="Account"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <User size={20} />
              </button>

              {isMobileMenuOpen && (
                <div className="absolute top-8 right-0 bg-white border rounded-xl shadow-md min-w-[180px] py-2 z-50 text-sm cursor-pointer">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate("/addresses");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    My Addresses
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate("/order");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    My Orders
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

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

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-7xl mx-auto bg-white rounded-2xl shadow-md px-4 py-3 flex flex-col gap-1 font-body text-sm">
          <Link
            to="/"
            className="py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Categories
          </Link>
          <Link
            to="/contact"
            className="py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About Us
          </Link>

          <div className="border-t my-1" />

          {!token ? (
            <>
              <button
                className="py-2 text-left cursor-pointer"
                onClick={() => {
                  navigate("/login");
                  setIsMobileMenuOpen(false);
                }}
              >
                Login
              </button>
              <button
                className="py-2 text-left cursor-pointer"
                onClick={() => {
                  navigate("/signup");
                  setIsMobileMenuOpen(false);
                }}
              >
                Signup
              </button>
            </>
          ) : (
            <>
              <button
                className="py-2 text-left cursor-pointer"
                onClick={() => {
                  navigate("/addresses");
                  setIsMobileMenuOpen(false);
                }}
              >
                My Addresses
              </button>
              <button
                className="py-2 text-left cursor-pointer"
                onClick={() => {
                  navigate("/order");
                  setIsMobileMenuOpen(false);
                }}
              >
                My Orders
              </button>
              <button
                className="py-2 text-left text-red-600 cursor-pointer"
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                  setIsMobileMenuOpen(false);
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;