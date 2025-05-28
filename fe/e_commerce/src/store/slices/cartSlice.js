import { createSlice } from "@reduxjs/toolkit";
import { ToastProvider } from "../../components/ToastProvider";

// Load cart from localStorage if available
const loadCartFromStorage = () => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        console.error("Failed to parse cart from localStorage:", e);
      }
    }
  }
  return { items: [], totalItems: 0, totalAmount: 0 };
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, variant, quantity } = action.payload;

      // Check if this product variant is already in the cart
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === product._id && item.variantId === variant._id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const newQuantity = state.items[existingItemIndex].quantity + quantity;
        // Check if new quantity exceeds inventory
        if (newQuantity <= variant.inventory) {
          state.items[existingItemIndex].quantity = newQuantity;
        } else {
          // If exceeds inventory, set to max available
          state.items[existingItemIndex].quantity = variant.inventory;
          ToastProvider.warning(`Only ${variant.inventory} items available`);
        }
      } else {
        // Add new item
        state.items.push({
          productId: product._id,
          title: product.title,
          variantId: variant._id,
          variantName: variant.name,
          price: variant.price,
          image: variant.image || product.image,
          quantity: Math.min(quantity, variant.inventory),
          inventory: variant.inventory,
        });
      }

      // Update totals
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(state));
    },

    removeFromCart: (state, action) => {
      const { productId, variantId } = action.payload;

      // Filter out the item to remove
      state.items = state.items.filter(
        (item) =>
          !(item.productId === productId && item.variantId === variantId)
      );

      // Update totals
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(state));
    },

    increaseQuantity: (state, action) => {
      const { productId, variantId } = action.payload;
      const item = state.items.find(
        (item) => item.productId === productId && item.variantId === variantId
      );

      if (item) {
        // Check if new quantity exceeds inventory
        if (item.quantity < item.inventory) {
          item.quantity += 1;
          state.totalItems += 1;
          state.totalAmount += item.price;
        } else {
          ToastProvider.warning(`Only ${item.inventory} items available`);
        }
      }

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(state));
    },

    decreaseQuantity: (state, action) => {
      const { productId, variantId } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item.productId === productId && item.variantId === variantId
      );

      if (itemIndex >= 0) {
        const item = state.items[itemIndex];

        if (item.quantity > 1) {
          item.quantity -= 1;
          state.totalItems -= 1;
          state.totalAmount -= item.price;
        } else {
          // Remove item if quantity would be 0
          state.items.splice(itemIndex, 1);
          state.totalItems -= 1;
          state.totalAmount -= item.price;
        }
      }

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
