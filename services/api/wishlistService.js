import axiosInstance from '../../lib/api/axiosInstance';

// API functions - these are pure functions that return promises
export const wishlistApi = {
  getWishlist: async () => {
    const response = await axiosInstance.get('/api/wishlist/');
    return response.data;
  },

  addToWishlist: async (productId) => {
    const response = await axiosInstance.post('/api/wishlist/', { 
      product_id: productId 
    });
    return response.data;
  },

  removeFromWishlist: async (wishlistItemId) => {
    const response = await axiosInstance.delete(`/api/wishlist/${wishlistItemId}/`);
    return response.data;
  },

  removeFromWishlistByProductId: async (productId) => {
    // If your backend supports removal by product_id
    const response = await axiosInstance.delete(`/api/wishlist/product/${productId}/`);
    return response.data;
  },

  isInWishlist: async (productId) => {
    try {
      const response = await axiosInstance.get(`/api/wishlist/check/${productId}/`);
      return response.data.isInWishlist;
    } catch (error) {
      if (error.response?.status === 404) return false;
      throw error;
    }
  },

  clearWishlist: async () => {
    const response = await axiosInstance.delete('/api/wishlist/clear_all/');
    return response.data;
  },

  moveToCart: async (productId, quantity = 1) => {
    // This would be implemented based on your cart API
    // For now, just a placeholder that returns success
    return { success: true, message: 'Moved to cart' };
  }
};