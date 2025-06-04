'use client';
import React, { useState } from 'react';
import { useWishlist } from '../../hooks/useWishlist';
import LoadingSpinner from './components/LoadingSpinner';
import { Heart, Trash2, ShoppingCart, Check, ArrowRight, X } from 'lucide-react';
import { useCart } from '../../components/features/cart/CartContext';
import Link from 'next/link';

export default function WishlistPage() {
  const { 
    wishlist, 
    loading, 
    error,
    removeFromWishlistByProductId,
  } = useWishlist();
  
  const { addToCart } = useCart();
  const [removingItems, setRemovingItems] = useState(new Set());
  const [addingItems, setAddingItems] = useState(new Set());
  const [showCheckoutFlow, setShowCheckoutFlow] = useState(null); // Store product ID instead of boolean
  const [addedProduct, setAddedProduct] = useState(null);

  // Helper function to handle image URLs properly
  const getImageUrl = (imageUrl) => {
    if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      return imageUrl;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`;
  };

  // Handle remove from wishlist with loading state
  const handleRemoveFromWishlist = async (productId, productName) => {
    setRemovingItems(prev => new Set(prev).add(productId));
    try {
      await removeFromWishlistByProductId(productId);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle add to cart with loading state and checkout flow
  const handleAddToCart = async (wishlistItem) => {
    const { product } = wishlistItem;
    setAddingItems(prev => new Set(prev).add(product.id));
    
    // Helper function to extract relative path from full URL
    const getRelativeImagePath = (imageUrl) => {
      if (!imageUrl) return '';
      
      // If it's already a relative path, return as is
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        return imageUrl;
      }
      
      // Extract the path after /media/
      const mediaIndex = imageUrl.indexOf('/media/');
      if (mediaIndex !== -1) {
        return imageUrl.substring(mediaIndex);
      }
      
      // Fallback: try to extract everything after the domain
      try {
        const url = new URL(imageUrl);
        return url.pathname;
      } catch (e) {
        return imageUrl;
      }
    };
    
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        image: getRelativeImagePath(product.thumbnail_image),
        mrp: product.market_price,
        thumbnail_image: getRelativeImagePath(product.thumbnail_image),
        price: product.price,
        source: "wishlist"
      }, 1);
      
      // Show checkout flow for this specific product
      setAddedProduct(product);
      setShowCheckoutFlow(product.id);
      
      // Hide loading state
      setAddingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setAddingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  // Close checkout flow
  const closeCheckoutFlow = () => {
    setShowCheckoutFlow(null);
    setAddedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-sm text-gray-600 sm:text-base">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <p className="mb-4 text-sm text-red-500 sm:text-base">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <Heart size={48} className="mx-auto mb-4 text-gray-300 sm:w-16 sm:h-16" />
          <h2 className="mb-2 text-xl font-bold text-gray-800 sm:text-2xl">Your wishlist is empty</h2>
          <p className="mb-4 text-sm text-gray-600 sm:text-base">Start adding products you love!</p>
          <Link 
            href="/products" 
            className="inline-block px-4 py-2 text-sm text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 sm:px-6 sm:py-3 sm:text-base"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-3 py-4 mx-auto max-w-7xl sm:px-4 sm:py-8">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
          My Wishlist ({wishlist.length})
        </h1>
      </div>

      {/* Mobile optimized list view */}
      <div className="space-y-3 sm:space-y-4">
        {wishlist.map((wishlistItem) => {
          const { product } = wishlistItem;
          const isRemoving = removingItems.has(product.id);
          const isAdding = addingItems.has(product.id);
          const discountPercent = product.discount;
          const showingCheckout = showCheckoutFlow === product.id;
          
          return (
            <div 
              key={wishlistItem.id} 
              className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${
                isRemoving ? 'opacity-50 scale-95' : 'hover:shadow-md hover:border-pink-100'
              }`}
            >
              <div className="flex items-start gap-3 p-3 sm:items-center sm:gap-4 sm:p-4">
                {/* Product Image - Responsive sizing */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 overflow-hidden rounded-lg sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-50">
                    <img
                      src={getImageUrl(product.thumbnail_image)}
                      alt={product.name}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Badges - Responsive positioning */}
                  {(product.is_featured || product.is_popular) && (
                    <div className="absolute flex flex-col gap-1 -top-1 -left-1 sm:-top-2 sm:-left-2">
                      {product.is_featured && (
                        <span className="px-1 py-0.5 text-xs font-medium text-orange-600 bg-orange-100 rounded-full sm:px-1.5">
                          FEATURED
                        </span>
                      )}
                      {product.is_popular && (
                        <span className="px-1 py-0.5 text-xs font-medium text-pink-600 bg-pink-100 rounded-full sm:px-1.5">
                          POPULAR
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Product Info - Flexible layout */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${product.slug}`} className="block group">
                    <h3 className="mb-1 text-sm font-semibold text-gray-900 transition-colors sm:text-base lg:text-lg group-hover:text-pink-600 line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {product.category && (
                    <p className="mb-1 text-xs text-gray-500 sm:text-sm sm:mb-2">{product.category.name}</p>
                  )}
                  
                  {/* Price Section - Responsive layout */}
                  <div className="flex flex-wrap items-center gap-2 mb-2 sm:gap-3">
                    <span className="text-base font-bold text-gray-900 sm:text-lg lg:text-xl">
                      ₹{parseFloat(product.price).toLocaleString('en-IN', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </span>
                    {parseFloat(product.market_price) > parseFloat(product.price) && (
                      <>
                        <span className="text-xs text-gray-400 line-through sm:text-sm">
                          ₹{parseFloat(product.market_price).toLocaleString('en-IN', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}
                        </span>
                        {discountPercent > 0 && (
                          <span className="px-1.5 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-md sm:px-2 sm:py-1">
                            Save {discountPercent}%
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Mobile-first action buttons */}
                  <div className="flex items-center gap-2 mt-2 sm:hidden">
                    <button
                      onClick={() => handleAddToCart(wishlistItem)}
                      disabled={isAdding}
                      className="flex items-center justify-center flex-1 gap-1.5 px-3 py-2 text-xs font-medium text-white bg-pink-600 rounded-md transition-all duration-200 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAdding ? (
                        <>
                          <div className="w-3 h-3 border border-white rounded-full border-t-transparent animate-spin" />
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={14} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                      disabled={isRemoving}
                      className="flex items-center justify-center w-8 h-8 text-red-500 transition-colors rounded-md bg-red-50 hover:bg-red-100 disabled:opacity-50"
                      title="Remove from wishlist"
                    >
                      {isRemoving ? (
                        <div className="w-3 h-3 border border-red-500 rounded-full border-t-transparent animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Desktop action buttons */}
                <div className="items-center hidden gap-3 sm:flex">
                  <button
                    onClick={() => handleAddToCart(wishlistItem)}
                    disabled={isAdding}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg transition-all duration-200 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed lg:px-4 lg:py-2.5 lg:min-w-[120px]"
                  >
                    {isAdding ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                        <span className="hidden sm:inline">Adding...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                    disabled={isRemoving}
                    className="flex items-center justify-center text-red-500 transition-colors rounded-lg w-9 h-9 lg:w-10 lg:h-10 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                    title="Remove from wishlist"
                  >
                    {isRemoving ? (
                      <div className="w-4 h-4 border-2 border-red-500 rounded-full border-t-transparent animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Inline Checkout Flow - Shows below the product when item is added */}
              {showingCheckout && addedProduct && (
                <div className="border-t border-gray-100 bg-green-50">
                  <div className="p-3 sm:p-4">
                    {/* Success message */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full sm:w-8 sm:h-8">
                          <Check size={14} className="text-green-600 sm:w-4 sm:h-4" />
                        </div>
                        <span className="text-sm font-medium text-green-800 sm:text-base">Added to Cart!</span>
                      </div>
                      <button
                        onClick={closeCheckoutFlow}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Product summary */}
                    <div className="flex items-center gap-3 p-2 mb-3 bg-white rounded-lg sm:p-3">
                      <img
                        src={getImageUrl(addedProduct.thumbnail_image)}
                        alt={addedProduct.name}
                        className="object-cover w-10 h-10 rounded-lg sm:w-12 sm:h-12"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate sm:text-sm">
                          {addedProduct.name}
                        </p>
                        <p className="text-xs text-gray-600 sm:text-sm">
                          ₹{parseFloat(addedProduct.price).toLocaleString('en-IN', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-3">
                      <Link 
                        href="/cart"
                        onClick={closeCheckoutFlow}
                        className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 sm:flex-1"
                      >
                        <span>View Cart</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>

                    <button
                      onClick={closeCheckoutFlow}
                      className="w-full mt-2 text-xs text-gray-600 transition-colors hover:text-gray-800 sm:text-sm"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}