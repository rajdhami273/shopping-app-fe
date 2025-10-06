import { callAPI } from "../middlewares/callAPI";

import { setProducts, setProduct } from "../slices/productSlice";

export function getProducts() {
  return callAPI("/product", "get", {}, (res) => {
    return setProducts(res.data);
  });
}

export function getProduct(id) {
  return callAPI(`/product/${id}`, "get", {}, (res) => {
    return setProduct(res.data);
  });
}
