"use client";

import { useState } from 'react';
import { useAuth } from '../context/AuthContext/AuthContext';
import {
  useWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useRemoveFromWishlistByProductIdMutation,
  useClearWishlistMutation,
  useMoveToCartMutation,
  useIsInWishlist,
  useWishlistItemByProductId
} from '../queries/wishlistQueries';

export const useWishlist = () => {
  const { user } = useAuth();
  const [toastMessage, setToastMessage] = useState('');

  // Queries
  const {
    data: wishlist = [],
    isLoading: loading,
    error,
    refetch
  } = useWishlistQuery();

  // Mutations
  const addToWishlistMutation = useAddToWishlistMutation();
  const removeFromWishlistMutation = useRemoveFromWishlistMutation();
  const removeFromWishlistByProductIdMutation = useRemoveFromWishlistByProductIdMutation();
  const clearWishlistMutation = useClearWishlistMutation();


  // Helper function to show toast messages
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Add to wishlist
  const addToWishlist = async (productId) => {
    if (!user) {
      showToast('Please login to add items to wishlist.');
      return false;
    }

    try {
      await addToWishlistMutation.mutateAsync(productId);
      showToast('Added to wishlist ❤️');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to add to wishlist';
      showToast(errorMessage);
      return false;
    }
  };

  // Remove from wishlist by wishlist item ID
  const removeFromWishlist = async (wishlistItemId) => {
    if (!user) {
      showToast('Please login to manage wishlist.');
      return false;
    }

    try {
      await removeFromWishlistMutation.mutateAsync(wishlistItemId);
      showToast('Removed from wishlist');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to remove from wishlist';
      showToast(errorMessage);
      return false;
    }
  };

  // Remove from wishlist by product ID
  const removeFromWishlistByProductId = async (productId) => {
    if (!user) {
      showToast('Please login to manage wishlist.');
      return false;
    }

    // First try to find the wishlist item locally
    const wishlistItem = wishlist.find(item => item.product?.id === productId);
    
    if (wishlistItem) {
      // Use the wishlist item ID if we have it
      return removeFromWishlist(wishlistItem.id);
    } else {
      // Fallback to remove by product ID (if backend supports it)
      try {
        await removeFromWishlistByProductIdMutation.mutateAsync(productId);
        showToast('Removed from wishlist');
        return true;
      } catch (error) {
        const errorMessage = error.response?.data?.detail || 
                            error.response?.data?.message || 
                            error.message || 
                            'Failed to remove from wishlist';
        showToast(errorMessage);
        return false;
      }
    }
  };

  // Check if product is in wishlist (client-side)
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product?.id === productId);
  };

  // Get wishlist item by product ID
  const getWishlistItemByProductId = (productId) => {
    return wishlist.find(item => item.product?.id === productId) || null;
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    if (!user) {
      showToast('Please login to manage wishlist.');
      return false;
    }

    try {
      await clearWishlistMutation.mutateAsync();
      showToast('Wishlist cleared');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to clear wishlist';
      showToast(errorMessage);
      return false;
    }
  };

  // Move item to cart
 

  // Toggle wishlist (add if not present, remove if present)
  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlistByProductId(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  return {
    // Data
    wishlist,
    loading: loading || 
             addToWishlistMutation.isPending || 
             removeFromWishlistMutation.isPending || 
             removeFromWishlistByProductIdMutation.isPending || 
             clearWishlistMutation.isPending ,
          
    error: error?.message || 
           addToWishlistMutation.error?.message || 
           removeFromWishlistMutation.error?.message || 
           removeFromWishlistByProductIdMutation.error?.message || 
           clearWishlistMutation.error?.message ,
           
    
    // Actions
    addToWishlist,
    removeFromWishlist,
    removeFromWishlistByProductId,
    isInWishlist,
    getWishlistItemByProductId,
    clearWishlist,
    
    toggleWishlist,
    refetch,

    // Mutation states
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending || removeFromWishlistByProductIdMutation.isPending,
    isClearingWishlist: clearWishlistMutation.isPending,

    // Toast message
    toastMessage,
    setToastMessage
  };
};

// Individual hooks for specific use cases
export const useWishlistItem = (productId) => {
  const { data: wishlist = [] } = useWishlistQuery();
  return wishlist.find(item => item.product?.id === productId) || null;
};

export const useWishlistCount = () => {
  const { data: wishlist = [] } = useWishlistQuery();
  return wishlist.length;
};

// Hook specifically for wishlist toggle functionality
export const useWishlistToggle = (productId) => {
  const { user } = useAuth();
  const isInWishlist = useIsInWishlist(productId);
  const wishlistItem = useWishlistItemByProductId(productId);
  const addMutation = useAddToWishlistMutation();
  const removeMutation = useRemoveFromWishlistMutation();

  const toggle = async () => {
    if (!user) {
      throw new Error('Please login to manage wishlist');
    }

    if (isInWishlist && wishlistItem) {
      await removeMutation.mutateAsync(wishlistItem.id);
    } else {
      await addMutation.mutateAsync(productId);
    }
  };

  return {
    isInWishlist,
    toggle,
    isLoading: addMutation.isPending || removeMutation.isPending,
    error: addMutation.error || removeMutation.error
  };
};