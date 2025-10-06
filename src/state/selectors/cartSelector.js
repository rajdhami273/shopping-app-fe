import { createSelector } from "@reduxjs/toolkit";

export const selectCartItems = (state) => state.cart.items;

export const selectCartItemsAsArray = createSelector(
  [selectCartItems],
  (items) => Object.values(items)
);
export const selectCartTotalItems = createSelector(
  [selectCartItemsAsArray],
  (items) => items.length
);
export const selectCartTotalPrice = createSelector(
  [selectCartItems],
  (items) => {
    return Object.values(items).reduce(
      (total, item) => total + item.quantity * (item.product?.price ?? 1),
      0
    );
  }
);
