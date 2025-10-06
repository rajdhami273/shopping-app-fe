import { createSelector } from "@reduxjs/toolkit";

export function selectProducts(state) {
  return state.product.products;
}

export const selectProductsArray = createSelector(
  [selectProducts],
  (products) => Object.values(products)
);

export const selectProduct = createSelector(
  [selectProducts],
  (products, productId) => products[productId]
);
