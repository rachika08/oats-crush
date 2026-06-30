import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartToast({ show, onClose }) {
  const navigate = useNavigate();
  const { openCart } = useCart();

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [show, onClose]);

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl px-6 py-4 flex items-center gap-4 min-w-[280px] transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
      <p className="font-body text-sm text-black flex-1">
        Added to cart successfully!
      </p>
      <button
        onClick={() => { onClose(); openCart(); }}
        className="bg-brand-orange text-white font-heading text-xs px-4 py-1.5 rounded-full hover:-translate-y-0.5 transition cursor-pointer"
      >
        VIEW CART
      </button>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-black text-lg leading-none cursor-pointer"
      >
        ×
      </button>
    </div>
  );
}