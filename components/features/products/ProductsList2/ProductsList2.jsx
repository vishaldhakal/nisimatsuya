"use client";

import { useState } from "react";
import { Grid3X3, List, ShoppingCart } from "lucide-react";
import ProductCard from "../ProductCard/ProductCard";
import { useCart } from "../../cart/CartContext";
import Image from "next/image";
import Link from "next/link";
import WishlistButton from '../../../../components/ui/WishlistButton';
import { useWishlistNotification } from '../../../../contexts/WishlistNotificationContext';

const getImageUrl = (imageUrl) => {
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  return `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`;
};

const ProductsList2 = ({
  products = [], 
  loading = false
}) => {
  const { addToCart } = useCart();
  const { showNotification } = useWishlistNotification();
  const [addedItems, setAddedItems] = useState({});
  const [viewMode, setViewMode] = useState('grid'); 

  const handleAddToCart = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      // Additional prevention for event bubbling
      e.nativeEvent?.stopImmediatePropagation();
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      mrp: product.mrp || product.market_price,
      thumbnail_image: product.thumbnail_image,
      price: product.price,
      perUnit: product.perUnit,
      source: product.source || "unknown"
    }, 1);
    
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 3000);
  };

 const handleWishlistToggle = (wasInWishlist, productId, result) => {
    // Check if user needs to login
    if (result?.requiresAuth) {
      showNotification('You must login to add items to wishlist', 'info');
      return;
    }
    
    // Check if there was an error
    if (result?.error) {
      showNotification('Something went wrong. Please try again.', 'error');
      return;
    }
    
    // Show success message based on the action
    if (result?.success) {
      if (wasInWishlist) {
        showNotification('Removed from wishlist', 'info');
      } else {
        showNotification('Added to wishlist ❤️', 'success');
      }
    }
  };

  const ProductListItem = ({ product }) => {
    const marketPrice = product.market_price || product.mrp;
    const sellingPrice = product.price;
    const isAdded = addedItems[product.id];

    return (
      <div className="flex flex-col items-start p-4 transition-all duration-300 bg-white border border-gray-200 sm:flex-row sm:items-center sm:p-6 rounded-2xl hover:shadow-lg group">
        {/* Product Image */}
        <div className="relative flex-shrink-0 w-full h-48 mb-4 sm:w-32 sm:h-32 sm:mb-0 sm:mr-6">
          <Link href={`/products/${typeof product.slug === 'string' ? product.slug : product.slug.current}`}>
            <Image
              src={getImageUrl(product.images[0].image)}
              alt={product.name}
              width={128}
              height={128}
              className="object-contain w-full h-full rounded-xl"
            />
          </Link>
        </div>

        {/* Product Info */}
        <div className="flex-1 w-full min-w-0 sm:w-auto">
          <div className="mb-4 sm:mb-2">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-2">
              {product.is_featured && (
                <span className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full">FEATURED</span>
              )}
              {product.is_popular && (
                <span className="px-2 py-1 text-xs font-medium text-pink-600 bg-pink-100 rounded-full">POPULAR</span>
              )}
            </div>

            {/* Product Name - Only this is clickable */}
            <Link href={`/products/${typeof product.slug === 'string' ? product.slug : product.slug.current}`}>
              <h3 className="mb-2 text-base font-semibold text-gray-900 transition-colors duration-200 cursor-pointer sm:text-lg hover:text-pink-600 line-clamp-2">
                {product.name}
              </h3>
            </Link>

            {/* Pricing - Not wrapped in Link */}
            <div className="flex flex-col">
              {marketPrice && parseFloat(marketPrice) > parseFloat(sellingPrice) && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{parseFloat(marketPrice).toLocaleString('en-IN', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </span>
              )}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <span className="text-xl font-bold text-gray-900 sm:text-2xl">
                  ₹{parseFloat(sellingPrice).toLocaleString('en-IN', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </span>
                {product.discount && parseFloat(product.discount) > 0 && (
                  <span className="self-start px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-lg sm:px-3 sm:text-sm">
                    Save {parseFloat(product.discount)}%
                  </span>
                )}
              </div>
              {product.perUnit && (
                <span className="mt-1 text-sm text-gray-500">
                  ({product.perUnit})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center w-full gap-3 mt-4 sm:flex-col sm:items-end sm:gap-3 sm:w-auto sm:ml-4 sm:mt-0">
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <WishlistButton
              productId={product.id}
              size="sm"
              variant="default"
              className="flex-shrink-0 shadow hover:shadow-md"
              onToggle={(wasInWishlist, productId, e) => handleWishlistToggle(wasInWishlist, productId, e)}
            />
          </div>
          
          <button
            onClick={(e) => handleAddToCart(product, e)}
            disabled={isAdded}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 font-medium rounded-xl transition-all duration-200 flex-1 sm:flex-initial text-sm sm:text-base ${
              isAdded 
                ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-pink-600 to-pink-500 text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="whitespace-nowrap">{isAdded ? 'Added!' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="px-4 space-y-4 sm:space-y-6 sm:px-0">
        {/* View Toggle Skeleton */}
        <div className="flex justify-end">
          <div className="w-20 h-8 bg-gray-200 rounded-lg sm:w-24 sm:h-10 animate-pulse"></div>
        </div>
        
        {/* Products Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-2xl sm:h-80 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="px-4 py-12 text-center sm:py-16">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full sm:w-24 sm:h-24">
          <ShoppingCart className="w-8 h-8 text-gray-400 sm:w-10 sm:h-10" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">No products found</h3>
        <p className="max-w-md mx-auto text-sm text-gray-500 sm:text-base">
          Try adjusting your search or filter criteria to find what you're looking for
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-4 sm:space-y-6 sm:px-0">
      {/* View Toggle Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600 sm:text-base">
            Showing <span className="font-semibold">{products.length}</span> products
          </p>
        </div>
        
        <div className="flex items-center w-full gap-1 p-1 bg-gray-100 rounded-lg sm:gap-2 sm:w-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-200 flex-1 sm:flex-initial text-sm sm:text-base ${
              viewMode === 'grid'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Grid3X3 size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-200 flex-1 sm:flex-initial text-sm sm:text-base ${
              viewMode === 'list'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <List size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>List</span>
          </button>
        </div>
      </div>

      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {products.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList2;