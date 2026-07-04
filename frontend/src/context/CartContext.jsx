import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("cart"); // "cart" | "shipping" | "order"

  const openCart = (step = "cart") => {
    setCheckoutStep(step);
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setCheckoutStep("cart");
  };

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        openCart,
        closeCart,
        checkoutStep,
        setCheckoutStep,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}