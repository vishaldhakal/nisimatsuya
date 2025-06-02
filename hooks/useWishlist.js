"use client";

import { useState } from 'react';
import { useAuth } from '../context/AuthContext/AuthContext';
import {
  useWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
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
  const addMutation = useAddToWishlistMutation();
  const removeMutation = useRemoveFromWishlistMutation();

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
      await addMutation.mutateAsync(productId);
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

  // Remove from wishlist by product ID (find item first)
  const removeFromWishlistByProductId = async (productId) => {
    if (!user) {
      showToast('Please login to manage wishlist.');
      return false;
    }

    const wishlistItem = wishlist.find(item => item.product?.id === productId);
    
    if (!wishlistItem) {
      showToast('Item not found in wishlist');
      return false;
    }

    try {
      await removeMutation.mutateAsync(wishlistItem.id);
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

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product?.id === productId);
  };

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
    loading: loading || addMutation.isPending || removeMutation.isPending,
    error: error?.message || addMutation.error?.message || removeMutation.error?.message,
    
    // Actions
    addToWishlist,
    removeFromWishlistByProductId,
    isInWishlist,
    toggleWishlist,
    refetch,

    // Mutation states
    isAddingToWishlist: addMutation.isPending,
    isRemovingFromWishlist: removeMutation.isPending,

    // Toast message
    toastMessage,
    setToastMessage
  };
};

// Individual hooks for specific use cases
export const useWishlistCount = () => {
  const { data: wishlist = [] } = useWishlistQuery();
  return wishlist.length;
};

// Hook for wishlist toggle functionality
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