import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";

const CategoryProducts = () => {
  const { id } = useParams();

  // Load cached products for this category instantly
  const [products, setProducts] = useState(() => {
    const cached = localStorage.getItem(`category-${id}`);
    return cached ? JSON.parse(cached) : [];
  });

  const [loading, setLoading] = useState(
    !localStorage.getItem(`category-${id}`)
  );

  useEffect(() => {
    fetchProductsByCategory();
  }, [id]);

  const fetchProductsByCategory = async () => {
    try {
      if (products.length === 0) {
        setLoading(true);
      }

      const res = await api.get(`/product/category/${id}`);

      setProducts(res.data);

      // Save products for this category
      localStorage.setItem(
        `category-${id}`,
        JSON.stringify(res.data)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Loading text while refreshing */}
        {loading && (
          <p className="text-gray-500 mb-4">
            Refreshing products...
          </p>
        )}

        {/* Category Name */}
        <h1 className="text-3xl font-bold mb-8">
          {products.length > 0
            ? products[0].category?.name
            : "Category"}
        </h1>

        {/* No Products */}
        {products.length === 0 && !loading ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold">
              No products found in this category
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default CategoryProducts;