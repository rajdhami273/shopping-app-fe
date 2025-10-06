import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "productSlice",
  initialState: {
    products: {},
  },
  reducers: {
    setProducts: (state, action) => {
      const productsMap = {};
      action.payload.forEach((product) => {
        productsMap[product._id] = product;
      });
      state.products = productsMap;
    },
    setProduct: (state, action) => {
      state.products[action.payload._id] = action.payload;
    },
    deleteProduct: (state, action) => {
      delete state.products[action.payload._id];
    },
  },
});

export const { setProducts, setProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;
