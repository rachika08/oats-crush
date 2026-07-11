import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />

      <h2 className="text-lg font-semibold mt-3">
        {product.name}
      </h2>

      <p className="text-gray-600 mt-1">
        ₹{product.packSizes?.find((p) => p.units === 1)?.price ?? "N/A"}
      </p>

      <button
        onClick={() => navigate(`/product/${product._id}`)}
        className="mt-3 bg-black text-white px-4 py-2 rounded"
      >
        View Details
      </button>
    </div>
  );
};

export default ProductCard;