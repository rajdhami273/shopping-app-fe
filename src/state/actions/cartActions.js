import { callAPI } from "../middlewares/callAPI";
import { setCart } from "../slices/cartSlice";

export function addToCart(payload) {
  return callAPI("/cart/add-product", "post", payload, (res) => {
    return setCart(res.data);
  });
}

export function getCartItems() {
  return callAPI("/cart", "get", {}, (res) => {
    return setCart(res.data);
  });
}

export function removeFromCart(productId) {
  return callAPI(`/cart/remove-product/${productId}`, "delete", {}, (res) => {
    return setCart(res.data);
  });
}

export function updateQuantity(payload) {
  return callAPI(
    `/cart/update-product/${payload.productId}`,
    "put",
    payload,
    (res) => {
      return setCart(res.data);
    }
  );
}

export function clearCart() {
  return callAPI("/cart/clear", "delete", {}, (res) => {
    return setCart(res.data);
  });
}
