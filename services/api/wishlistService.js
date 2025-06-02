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
  
};