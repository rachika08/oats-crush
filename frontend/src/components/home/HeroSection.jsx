import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 border-b">
      <div className="max-w-7xl mx-auto">

        <div className="text-center">

          <h1 className="text-5xl font-bold mb-4">
            Welcome to Oats Crush
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Discover premium products at affordable prices.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-black text-white rounded"
          >
            Shop Now
          </button>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;