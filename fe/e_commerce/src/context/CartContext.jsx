import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    product: null,
    variant: null,
    quantity: 1,
  });

  const addToCart = (product, variant, quantity) => {
    setCart({
      product,
      variant,
      quantity,
    });
  };

  const clearCart = () => {
    setCart({
      product: null,
      variant: null,
      quantity: 1,
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
