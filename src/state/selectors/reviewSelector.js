// ts-strict

import { createSelector } from '@reduxjs/toolkit';

// Base selector
const selectReviewsState = (state) => state.reviews;

// Get all reviews as an array
export const selectAllReviews = createSelector(
  [selectReviewsState],
  (reviewsState) => Object.values(reviewsState.reviews)
);

// Get reviews for a specific product
export const selectProductReviews = createSelector(
  [selectReviewsState, (state, productId) => productId],
  (reviewsState, productId) => reviewsState.productReviews[productId] || []
);

// Get a specific review by ID
export const selectReviewById = createSelector(
  [selectReviewsState, (state, reviewId) => reviewId],
  (reviewsState, reviewId) => reviewsState.reviews[reviewId]
);

// Get average rating for a product
export const selectProductAverageRating = createSelector(
  [selectProductReviews],
  (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  }
);

// Get review count for a product
export const selectProductReviewCount = createSelector(
  [selectProductReviews],
  (reviews) => reviews ? reviews.length : 0
);

// Get rating distribution for a product
export const selectProductRatingDistribution = createSelector(
  [selectProductReviews],
  (reviews) => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    if (!reviews || reviews.length === 0) return distribution;
    
    reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    
    return distribution;
  }
);

// Get recent reviews (last 10)
export const selectRecentReviews = createSelector(
  [selectAllReviews],
  (reviews) => 
    [...reviews]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
);

// Get reviews by user
export const selectUserReviews = createSelector(
  [selectAllReviews, (state, userId) => userId],
  (reviews, userId) => reviews.filter(review => review.user?._id === userId)
);

// Get reviews with images
export const selectReviewsWithImages = createSelector(
  [selectAllReviews],
  (reviews) => reviews.filter(review => review.assets && review.assets.length > 0)
);

// Get top rated reviews (4+ stars)
export const selectTopRatedReviews = createSelector(
  [selectAllReviews],
  (reviews) => reviews.filter(review => review.rating >= 4)
);

// Check if product has reviews
export const selectHasProductReviews = createSelector(
  [selectProductReviews],
  (reviews) => reviews && reviews.length > 0
);
