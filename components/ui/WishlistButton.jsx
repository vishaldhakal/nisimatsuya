"use client";
import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlistToggle } from '../../hooks/useWishlist';

const WishlistButton = ({
  productId,
  size = 'md',
  variant = 'default',
  className = '',
  showTooltip = true,
  onToggle
}) => {
  const {
    isInWishlist,
    toggle: toggleWishlist,
    isLoading: wishlistLoading,
    error: wishlistError
  } = useWishlistToggle(productId);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const variantClasses = {
    default: `
      bg-white border border-gray-200 shadow-sm
      hover:shadow-md hover:border-gray-300
      ${isInWishlist ? 'border-pink-300 bg-pink-50' : ''}
    `,
    minimal: `
      bg-white/90 backdrop-blur-sm border border-gray-200/50
      hover:bg-white hover:border-gray-300
    `,
    card: `
      bg-white border border-gray-200 shadow-sm
      hover:shadow-md transition-shadow duration-200
      ${isInWishlist ? 'border-pink-300 bg-pink-50/50' : ''}
    `
  };

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const result = await toggleWishlist();
      
      if (onToggle) {

        onToggle(result.wasInWishlist, productId, result);
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={wishlistLoading}
      className={`
        relative flex items-center justify-center
        rounded-full transition-all duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${wishlistLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={showTooltip ? (isInWishlist ? 'Remove from wishlist' : 'Add to wishlist') : ''}
    >
      {/* Loading indicator */}
      {wishlistLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 border-2 border-pink-400 rounded-full border-t-transparent animate-spin"></div>
        </div>
      )}

      {/* Heart icon */}
      <Heart
        className={`
          transition-colors duration-200
          ${iconSizes[size]}
          ${wishlistLoading ? 'opacity-0' : 'opacity-100'}
          ${isInWishlist
            ? 'fill-pink-500 text-pink-500'
            : 'text-gray-400 hover:text-pink-400'
          }
        `}
      />
    </button>
  );
};

export default WishlistButton;