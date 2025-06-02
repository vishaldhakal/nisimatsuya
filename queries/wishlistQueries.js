import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '../services/api/wishlistService';
import { useAuth } from '../context/AuthContext/AuthContext';

// Query keys
export const wishlistKeys = {
  all: ['wishlist'],
  lists: () => [...wishlistKeys.all, 'list'],
};

// Main wishlist query
export const useWishlistQuery = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: wishlistKeys.lists(),
    queryFn: wishlistApi.getWishlist,
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: [],
  });
};

// Add to wishlist mutation
export const useAddToWishlistMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: wishlistApi.addToWishlist,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.lists() });
      
      const previousWishlist = queryClient.getQueryData(wishlistKeys.lists());
      
      // Optimistic update
      queryClient.setQueryData(wishlistKeys.lists(), (old) => {
        if (!old) return [];
        const tempItem = {
          id: `temp-${Date.now()}`,
          product: { id: productId },
          temp: true
        };
        return [...old, tempItem];
      });
      
      return { previousWishlist };
    },
    onError: (err, productId, context) => {
      queryClient.setQueryData(wishlistKeys.lists(), context.previousWishlist);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.lists() });
    },
  });
};

// Remove from wishlist mutation
export const useRemoveFromWishlistMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: wishlistApi.removeFromWishlist,
    onMutate: async (wishlistItemId) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.lists() });
      
      const previousWishlist = queryClient.getQueryData(wishlistKeys.lists());
      
      // Optimistic removal
      queryClient.setQueryData(wishlistKeys.lists(), (old) => {
        if (!old) return [];
        return old.filter(item => item.id !== wishlistItemId);
      });
      
      return { previousWishlist };
    },
    onError: (err, wishlistItemId, context) => {
      queryClient.setQueryData(wishlistKeys.lists(), context.previousWishlist);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.lists() });
    },
  });
};

// Helper hooks
export const useIsInWishlist = (productId) => {
  const { data: wishlist } = useWishlistQuery();
  return wishlist?.some(item => item.product?.id === productId) || false;
};

export const useWishlistItemByProductId = (productId) => {
  const { data: wishlist } = useWishlistQuery();
  return wishlist?.find(item => item.product?.id === productId) || null;
};