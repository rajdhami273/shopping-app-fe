// ts-strict

import { createSlice } from '@reduxjs/toolkit';

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: {}, // Map of { reviewId: review }
    productReviews: {}, // Map of { productId: [reviews] }
  },
  reducers: {
    setReviews: (state, action) => {
      const reviewsMap = {};
      action.payload.forEach((review) => {
        reviewsMap[review._id] = review;
      });
      state.reviews = reviewsMap;
    },
    
    setProductReviews: (state, action) => {
      const { productId, reviews } = action.payload;
      state.productReviews[productId] = reviews;
      
      // Also add to main reviews map
      reviews.forEach((review) => {
        state.reviews[review._id] = review;
      });
    },
    
    addReview: (state, action) => {
      const review = action.payload;
      
      // Add to main reviews map
      state.reviews[review._id] = review;
      
      // Add to product-specific reviews if they exist
      const productId = review.product;
      if (state.productReviews[productId]) {
        // Add to beginning of array (most recent first)
        state.productReviews[productId].unshift(review);
      }
    },
    
    updateReview: (state, action) => {
      const review = action.payload;
      const reviewId = review._id;
      
      // Update in main reviews map
      if (state.reviews[reviewId]) {
        state.reviews[reviewId] = review;
      }
      
      // Update in product-specific reviews
      const productId = review.product;
      if (state.productReviews[productId]) {
        const index = state.productReviews[productId].findIndex(r => r._id === reviewId);
        if (index !== -1) {
          state.productReviews[productId][index] = review;
        }
      }
    },
    
    removeReview: (state, action) => {
      const reviewId = action.payload;
      const review = state.reviews[reviewId];
      
      // Remove from main reviews map
      delete state.reviews[reviewId];
      
      // Remove from product-specific reviews if it exists
      if (review) {
        const productId = review.product;
        if (state.productReviews[productId]) {
          state.productReviews[productId] = state.productReviews[productId].filter(
            r => r._id !== reviewId
          );
        }
      }
    },
    
    clearProductReviews: (state, action) => {
      const productId = action.payload;
      if (productId) {
        delete state.productReviews[productId];
      } else {
        state.productReviews = {};
      }
    },
    
    clearAllReviews: (state) => {
      state.reviews = {};
      state.productReviews = {};
    },
  },
});

export const {
  setReviews,
  setProductReviews,
  addReview,
  updateReview,
  removeReview,
  clearProductReviews,
  clearAllReviews,
} = reviewSlice.actions;

export default reviewSlice.reducer;
