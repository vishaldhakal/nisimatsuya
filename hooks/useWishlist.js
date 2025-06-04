"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext/AuthContext';
import {
  useWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useIsInWishlist,
  useWishlistItemByProductId
} from '../queries/wishlistQueries';

export const useWishlist = () => {
  const { user } = useAuth();
  const router = useRouter();
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

  // Helper function to handle unauthenticated users
  const handleUnauthenticated = () => {
    router.push('/login');
    return false;
  };

  // Add to wishlist
  const addToWishlist = async (productId) => {
    if (!user) {
      return handleUnauthenticated();
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
      return handleUnauthenticated();
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
    if (!user) {
      return handleUnauthenticated();
    }

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
  const router = useRouter();
  const isInWishlist = useIsInWishlist(productId);
  const wishlistItem = useWishlistItemByProductId(productId);
  const addMutation = useAddToWishlistMutation();
  const removeMutation = useRemoveFromWishlistMutation();

  const toggle = async () => {
    // Return early with specific result for unauthenticated users
    if (!user) {
      router.push('/login');
      return { success: false, requiresAuth: true, wasInWishlist: false };
    }

    try {
      const wasInWishlist = isInWishlist;
      
      if (isInWishlist && wishlistItem) {
        await removeMutation.mutateAsync(wishlistItem.id);
      } else {
        await addMutation.mutateAsync(productId);
      }
      
      return { success: true, requiresAuth: false, wasInWishlist };
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      return { success: false, requiresAuth: false, wasInWishlist: isInWishlist, error };
    }
  };

  return {
    isInWishlist,
    toggle,
    isLoading: addMutation.isPending || removeMutation.isPending,
    error: addMutation.error || removeMutation.error
  };
};