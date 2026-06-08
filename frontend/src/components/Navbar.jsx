// src/components/Navbar.jsx

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios"; // adjust path

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

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
    <nav className="border-b bg-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Oats Crush
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          <Link to="/">Home</Link>

          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              Categories
            </button>

            {isCategoryOpen && (
              <div className="absolute top-8 left-0 bg-white border shadow-md min-w-[200px]">

                {categories.map((category) => (
                  <div
                    key={category._id}
                    onClick={() => {
                      navigate(`/category/${category._id}`);
                      setIsCategoryOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {category.name}
                  </div>
                ))}

              </div>
            )}
          </div>

        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {!token ? (
            <>
              <button
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
              >
                Signup
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/cart")}
              >
                Cart
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>
    </nav>
  );
};

export default Navbar;