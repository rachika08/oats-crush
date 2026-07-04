import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Checkout is no longer a standalone page — it now lives inside the
// cart drawer as the "shipping" and "order" states. This route is kept
// only so old bookmarks/links to /checkout still work.
export default function Checkout() {
  const navigate = useNavigate();
  const { openCart } = useCart();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    openCart("shipping");
    navigate("/", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}