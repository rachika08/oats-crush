import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartToast({
  show,
  onClose,
  message = "Added to cart successfully!",
  variant = "success",
}) {
  const navigate = useNavigate();
  const { openCart } = useCart();

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [show, onClose]);

  const dotColor = variant === "success" ? "bg-green-500" : "bg-brand-orange";

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl px-5 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-[calc(100%-2rem)] max-w-[360px] sm:min-w-[280px] sm:w-auto transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className={`w-2 h-2 rounded-full ${dotColor} flex-shrink-0`} />
        <p className="font-body text-sm text-black flex-1">
          {message}
        </p>
        <button
          onClick={onClose}
          className="sm:hidden text-gray-400 hover:text-black text-lg leading-none cursor-pointer flex-shrink-0"
        >
          ×
        </button>
      </div>

      {variant === "success" && (
        <button
          onClick={() => { onClose(); openCart(); }}
          className="bg-brand-orange text-white font-heading text-xs px-4 py-2 sm:py-1.5 rounded-full hover:-translate-y-0.5 transition cursor-pointer w-full sm:w-auto"
        >
          VIEW CART
        </button>
      )}

      <button
        onClick={onClose}
        className="hidden sm:block text-gray-400 hover:text-black text-lg leading-none cursor-pointer flex-shrink-0"
      >
        ×
      </button>
    </div>
  );
}