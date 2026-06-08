import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios"; // adjust path if needed
import ProductCard from "../components/ProductCard"; // adjust path if needed
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
const CategoryProducts = () => {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsByCategory();
  }, [id]);

  const fetchProductsByCategory = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/product/category/${id}`
      );

      setProducts(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <h2 className="text-xl font-semibold">
          Loading products...
        </h2>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Category Name */}
      <h1 className="text-3xl font-bold mb-8">
        {products.length > 0
          ? products[0].category?.name
          : "Category"}
      </h1>

      {/* No Products */}
      {products.length === 0 ? (
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
    <Footer/>
    </>
  );
};

export default CategoryProducts;