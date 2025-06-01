import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '../services/api/wishlistService';
import { useAuth } from '../context/AuthContext/AuthContext';

// Query keys
export const wishlistKeys = {
  all: ['wishlist'],
  lists: () => [...wishlistKeys.all, 'list'],
  list: (filters) => [...wishlistKeys.lists(), { filters }],
  details: () => [...wishlistKeys.all, 'detail'],
  detail: (id) => [...wishlistKeys.details(), id],
  check: (productId) => [...wishlistKeys.all, 'check', productId],
};

// Custom hooks using TanStack Query
export const useWishlistQuery = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: wishlistKeys.lists(),
    queryFn: wishlistApi.getWishlist,
    enabled: !!user, // Only fetch if user is logged in
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('Wishlist fetch error:', error);
    }
  });
};

export const useAddToWishlistMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: wishlistApi.addToWishlist,
    onMutate: async (productId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: wishlistKeys.lists() });
      
      // Snapshot the previous value
      const previousWishlist = queryClient.getQueryData(wishlistKeys.lists());
      
      // Optimistically update to the new value
      queryClient.setQueryData(wishlistKeys.lists(), (old) => {
        if (!old) return [];
        
        // Create a temporary wishlist item for optimistic update
        const tempItem = {
          id: `temp-${Date.now()}`,
          product: { id: productId },
          temp: true
        };
        
        return [...old, tempItem];
      });
      
      // Return a context object with the snapshotted value
      return { previousWishlist };
    },
    onError: (err, productId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(wishlistKeys.lists(), context.previousWishlist);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: wishlistKeys.lists() });
    },
  });
};

export const useRemoveFromWishlistMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: wishlistApi.removeFromWishlist,
    onMutate: async (wishlistItemId) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.lists() });
      
      const previousWishlist = queryClient.getQueryData(wishlistKeys.lists());
      
      // Optimistically remove the item
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

export const useRemoveFromWishlistByProductIdMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: wishlistApi.removeFromWishlistByProductId,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.lists() });
      
      const previousWishlist = queryClient.getQueryData(wishlistKeys.lists());
      
      // Optimistically remove the item by product ID
      queryClient.setQueryData(wishlistKeys.lists(), (old) => {
        if (!old) return [];
        return old.filter(item => item.product?.id !== productId);
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

export const useClearWishlistMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: wishlistApi.clearWishlist,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.lists() });
      
      const previousWishlist = queryClient.getQueryData(wishlistKeys.lists());
      
      // Optimistically clear the wishlist
      queryClient.setQueryData(wishlistKeys.lists(), []);
      
      return { previousWishlist };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(wishlistKeys.lists(), context.previousWishlist);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.lists() });
    },
  });
};



// Hook to check if a product is in wishlist (client-side check)
export const useIsInWishlist = (productId) => {
  const { data: wishlist } = useWishlistQuery();
  
  return wishlist?.some(item => item.product?.id === productId) || false;
};

// Hook to get wishlist item by product ID
export const useWishlistItemByProductId = (productId) => {
  const { data: wishlist } = useWishlistQuery();
  
  return wishlist?.find(item => item.product?.id === productId) || null;
};