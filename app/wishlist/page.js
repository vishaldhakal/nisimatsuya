'use client';
import React, { useState } from 'react';
import { useWishlist } from '../../hooks/useWishlist';
import LoadingSpinner from './components/LoadingSpinner';
import { Heart, Grid3X3, List, Trash2, ShoppingCart } from 'lucide-react';
import ProductCard from '../../components/features/products/ProductCard/ProductCard'; 
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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

  // Handle add to cart with loading state
  const handleAddToCart = async (wishlistItem) => {
    const { product } = wishlistItem;
    setAddingItems(prev => new Set(prev).add(product.id));
    
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        image: product.thumbnail_image,
        mrp: product.market_price,
        thumbnail_image: product.thumbnail_image,
        price: product.price,
        source: "wishlist"
      }, 1);
      
      // Show success feedback briefly
      setTimeout(() => {
        setAddingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(product.id);
          return newSet;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setAddingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  // Transform wishlist data for ProductCard - make it exactly match the expected format
  const transformWishlistItem = (wishlistItem) => {
    const { product } = wishlistItem;
    
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.price),
      mrp: parseFloat(product.market_price),
      market_price: parseFloat(product.market_price),
      thumbnail_image: product.thumbnail_image,
      source: "wishlist",
      // Make sure images array exists and has the expected format
      images: product.images || [{ image: product.thumbnail_image || '' }],
      category: product.category,
      is_featured: product.is_featured || false,
      is_popular: product.is_popular || false,
      isNew: product.isNew || false,
      discount: product.discount || 0,
      perUnit: product.perUnit || null,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4 text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Heart size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Your wishlist is empty</h2>
          <p className="mb-4 text-gray-600">Start adding products you love!</p>
          <Link 
            href="/products" 
            className="px-6 py-3 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <div className="flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          My Wishlist ({wishlist.length})
        </h1>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              viewMode === 'grid' 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid3X3 size={16} />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              viewMode === 'list' 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List size={16} />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((wishlistItem) => {
            const transformedProduct = transformWishlistItem(wishlistItem);
            const isRemoving = removingItems.has(wishlistItem.product.id);
            
            return (
              <div key={wishlistItem.id} className="relative group">
                {/* Overlay for removing state */}
                {isRemoving && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-white bg-opacity-80 rounded-3xl">
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto border-4 border-pink-500 rounded-full border-t-transparent animate-spin" />
                      <p className="mt-2 text-sm text-gray-600">Removing...</p>
                    </div>
                  </div>
                )}
                
                {/* Use the exact same ProductCard component */}
                <ProductCard product={transformedProduct} />
                
                {/* Remove Button Overlay */}
                <div className="absolute z-20 transition-opacity duration-200 opacity-100 top-3 left-3 sm:opacity-0 sm:group-hover:opacity-100">
                  <button
                    onClick={() => handleRemoveFromWishlist(wishlistItem.product.id, wishlistItem.product.name)}
                    disabled={isRemoving}
                    className="flex items-center justify-center w-8 h-8 text-red-500 transition-colors bg-white rounded-full shadow-lg hover:bg-red-50 disabled:opacity-50"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enhanced List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {wishlist.map((wishlistItem) => {
            const { product } = wishlistItem;
            const isRemoving = removingItems.has(product.id);
            const isAdding = addingItems.has(product.id);
            const discountPercent = product.discount;
            
            return (
              <div 
                key={wishlistItem.id} 
                className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${
                  isRemoving ? 'opacity-50 scale-95' : 'hover:shadow-md hover:border-pink-100'
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Product Image */}
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 overflow-hidden rounded-lg sm:w-24 sm:h-24 bg-gray-50">
                      <img
                        src={getImageUrl(product.thumbnail_image)}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    
                    {/* Badges */}
                    {(product.is_featured || product.is_popular) && (
                      <div className="absolute flex flex-col gap-1 -top-2 -left-2">
                        {product.is_featured && (
                          <span className="px-1.5 py-0.5 text-xs font-medium text-orange-600 bg-orange-100 rounded-full">
                            FEATURED
                          </span>
                        )}
                        {product.is_popular && (
                          <span className="px-1.5 py-0.5 text-xs font-medium text-pink-600 bg-pink-100 rounded-full">
                            POPULAR
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${product.slug}`} className="block group">
                      <h3 className="mb-1 text-base font-semibold text-gray-900 transition-colors sm:text-lg group-hover:text-pink-600 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {product.category && (
                      <p className="mb-2 text-sm text-gray-500">{product.category.name}</p>
                    )}
                    
                    {/* Price Section */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-gray-900 sm:text-xl">
                        ₹{parseFloat(product.price).toLocaleString('en-IN', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </span>
                      {parseFloat(product.market_price) > parseFloat(product.price) && (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            ₹{parseFloat(product.market_price).toLocaleString('en-IN', { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
                          </span>
                          {discountPercent > 0 && (
                            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md">
                              Save {discountPercent}%
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons - Consistent sizing */}
                  <div className="flex items-center gap-3">
                    {/* Add to Cart Button - Same size for all */}
                    <button
                      onClick={() => handleAddToCart(wishlistItem)}
                      disabled={isAdding}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 min-w-[120px] text-sm font-medium text-white bg-pink-600 rounded-lg transition-all duration-200 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    
                    {/* Remove Button - Consistent sizing */}
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                      disabled={isRemoving}
                      className="flex items-center justify-center w-10 h-10 text-red-500 transition-colors rounded-lg bg-red-50 hover:bg-red-100 disabled:opacity-50"
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}