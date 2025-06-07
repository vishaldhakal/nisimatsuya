
import axiosInstance from '../../lib/api/axiosInstance';

class ReviewService {
  constructor() {
    this.baseURL = '/api/products/reviews/';
  }

  // Handle API response errors
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 
                     error.response.data?.detail || 
                     `HTTP ${error.response.status}: ${error.response.statusText}`;
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Network error - no response received');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }

  // Get all reviews
  async getAllReviews() {
    try {
      const response = await axiosInstance.get(this.baseURL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      this.handleError(error);
    }
  }

  // Get reviews by product slug
  async getReviewsBySlug(slug) {
    try {
      const response = await axiosInstance.get(this.baseURL, {
        params: { slug }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for slug ${slug}:`, error);
      this.handleError(error);
    }
  }

  // Get reviews by product ID
  async getReviewsByProductId(productId) {
    try {
      const response = await axiosInstance.get(this.baseURL, {
        params: { product_id: productId }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for product ID ${productId}:`, error);
      this.handleError(error);
    }
  }

  // Create a new review
  async createReview(reviewData) {
    try {
      const response = await axiosInstance.post(this.baseURL, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      this.handleError(error);
    }
  }

  // Update a review
  async updateReview(reviewId, reviewData) {
    try {
      const response = await axiosInstance.put(`${this.baseURL}${reviewId}/`, reviewData);
      return response.data;
    } catch (error) {
      console.error(`Error updating review ${reviewId}:`, error);
      this.handleError(error);
    }
  }

  // Partial update a review
  async patchReview(reviewId, reviewData) {
    try {
      const response = await axiosInstance.patch(`${this.baseURL}${reviewId}/`, reviewData);
      return response.data;
    } catch (error) {
      console.error(`Error patching review ${reviewId}:`, error);
      this.handleError(error);
    }
  }

  // Delete a review
  async deleteReview(reviewId) {
    try {
      await axiosInstance.delete(`${this.baseURL}${reviewId}/`);
      return true;
    } catch (error) {
      console.error(`Error deleting review ${reviewId}:`, error);
      this.handleError(error);
    }
  }

  // Get review by ID
  async getReviewById(reviewId) {
    try {
      const response = await axiosInstance.get(`${this.baseURL}${reviewId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching review ${reviewId}:`, error);
      this.handleError(error);
    }
  }

  // Get reviews with pagination and filters
  async getReviewsWithPagination(options = {}) {
    try {
      const {
        page = 1,
        pageSize = 10,
        slug = null,
        productId = null,
        userId = null,
        rating = null,
        ordering = null
      } = options;

      const params = {
        page,
        page_size: pageSize
      };

      // Add optional filters
      if (slug) params.slug = slug;
      if (productId) params.product_id = productId;
      if (userId) params.user_id = userId;
      if (rating) params.rating = rating;
      if (ordering) params.ordering = ordering;

      const response = await axiosInstance.get(this.baseURL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching paginated reviews:', error);
      this.handleError(error);
    }
  }

  // Get reviews with custom filters
  async getReviewsWithFilters(filters = {}) {
    try {
      const response = await axiosInstance.get(this.baseURL, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered reviews:', error);
      this.handleError(error);
    }
  }

  // Get review statistics for a product
  async getReviewStats(slug) {
    try {
      const reviews = await this.getReviewsBySlug(slug);
      
      if (!reviews || reviews.length === 0) {
        return {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }

      const totalReviews = reviews.length;
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = (totalRating / totalReviews).toFixed(1);
      
      const ratingDistribution = reviews.reduce((dist, review) => {
        dist[review.rating] = (dist[review.rating] || 0) + 1;
        return dist;
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

      return {
        totalReviews,
        averageRating: parseFloat(averageRating),
        ratingDistribution
      };
    } catch (error) {
      console.error(`Error calculating review stats for ${slug}:`, error);
      this.handleError(error);
    }
  }

  // Bulk operations
  async bulkCreateReviews(reviewsData) {
    try {
      const promises = reviewsData.map(reviewData => 
        axiosInstance.post(this.baseURL, reviewData)
      );
      const responses = await Promise.all(promises);
      return responses.map(response => response.data);
    } catch (error) {
      console.error('Error bulk creating reviews:', error);
      this.handleError(error);
    }
  }

  // Get user's reviews
  async getUserReviews(userId) {
    try {
      const response = await axiosInstance.get(this.baseURL, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for user ${userId}:`, error);
      this.handleError(error);
    }
  }

  // Check if user can review product (optional - if your API supports this)
  async canUserReview(productId) {
    try {
      const response = await axiosInstance.get(`${this.baseURL}can-review/`, {
        params: { product_id: productId }
      });
      return response.data;
    } catch (error) {
      console.error(`Error checking review permission for product ${productId}:`, error);
      this.handleError(error);
    }
  }
}

// Create and export a singleton instance
const reviewService = new ReviewService();

export default reviewService;

// Named exports for specific methods if needed
export const {
  getAllReviews,
  getReviewsBySlug,
  getReviewsByProductId,
  createReview,
  updateReview,
  patchReview,
  deleteReview,
  getReviewById,
  getReviewsWithPagination,
  getReviewsWithFilters,
  getReviewStats,
  getUserReviews,
  canUserReview
} = reviewService;