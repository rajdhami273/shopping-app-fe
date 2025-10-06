// ts-strict

import { callAPI } from "../middlewares/callAPI";

// slice actions
import {
  setReviews,
  setProductReviews,
  addReview,
  removeReview,
} from "../slices/reviewSlice";

// Create a new review
export function createReview({ data, successCallback }) {
  return callAPI(
    "/review",
    "post",
    data,
    (res) => {
      return addReview(res.data);
    },
    () => successCallback?.()
  );
}

// Get reviews for a specific product
export function getProductReviews(productId) {
  return callAPI(`/review/product/${productId}`, "get", {}, (res) => {
    return setProductReviews({ productId, reviews: res.data });
  });
}

// Get all reviews
export function getAllReviews() {
  return callAPI("/review", "get", {}, (res) => {
    return setReviews(res.data);
  });
}

// Delete a review
export function deleteReview(reviewId) {
  return callAPI(`/review/${reviewId}`, "delete", {}, (res) => {
    return removeReview(reviewId);
  });
}
