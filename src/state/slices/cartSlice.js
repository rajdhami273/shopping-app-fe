import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: {}, // Map of { productId: quantity }
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items[product._id];

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items[product._id] = quantity;
      }
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      delete state.items[productId];
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items[productId];

      if (existingItem && quantity > 0) {
        existingItem.quantity = quantity;
      } else if (existingItem && quantity <= 0) {
        delete state.items[productId];
      }
    },

    clearCart: (state) => {
      state.items = {};
    },
    setCart: (state, action) => {
      const itemsMap = {};
      action.payload.products.forEach((item) => {
        itemsMap[item._id] = item;
      });
      state.items = itemsMap;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } =
  cartSlice.actions;
export default cartSlice.reducer;
