import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
const AllProducts = () => {
  const [products, setProducts] = useState([]);

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

  return (
    <>
    <Navbar/>
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          All Products
        </h2>

        {products.length === 0 ? (
          <p className="text-center">No products available</p>
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
    </section>
    <Footer/>
    </>
  );
};

export default AllProducts;