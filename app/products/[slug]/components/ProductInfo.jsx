// Updated ProductInfo component
import React from 'react';
import { Share2, Truck, Shield, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import WishlistButton from '../../../../components/ui/WishlistButton';
import { useWishlistNotification } from '../../../../contexts/WishlistNotificationContext';

export const ProductInfo = ({ 
  product, 
  categories, 
  quantity, 
  setQuantity, 
  handleAddToCart, 
  isAddedToCart, 
  totalItems 
}) => {
  const { showNotification } = useWishlistNotification();
  
  // Early return if product is missing
  if (!product) {
    return <div className="p-4">Loading product information...</div>;
  }

  // Safe numeric conversions
  const discountPercentage = Number(product.discount) || 0;
  const marketPrice = Number(product.market_price) || 0;
  const currentPrice = Number(product.price) || 0;
  const stock = Number(product.stock) || 0;
  const safeQuantity = Number(quantity) || 1;
  const safeTotalItems = Number(totalItems) || 0;

  // Safe string conversions
  const productName = String(product.name || 'Product Name');
  const productDescription = String(product.description || '');

  // Handle wishlist feedback
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

  // Handle share functionality
  const handleShare = async () => {
    const shareData = {
      title: productName,
      text: `Check out this product: ${productName}`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        showNotification('Product shared successfully!', 'success');
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        showNotification('Product link copied to clipboard!', 'success');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: try to copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        showNotification('Product link copied to clipboard!', 'success');
      } catch (clipboardError) {
        showNotification('Unable to share product', 'error');
      }
    }
  };

  return (
    <div className="p-4 space-y-4 sm:space-y-6 sm:p-0">
      {/* Header with title and wishlist/share buttons */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="flex-1 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
          {productName}
        </h1>
        
        {/* Wishlist and Share buttons positioned at top right */}
        <div className="flex gap-2 shrink-0">
          <WishlistButton
            productId={product.id}
            size="md"
            variant="filled"
            onToggle={handleWishlistToggle}
          />
          
          <button 
            onClick={handleShare}
            className="p-3 transition-colors border-2 border-gray-200 rounded-xl hover:bg-gray-50 shrink-0"
          >
            <Share2 className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Price Section - Stack on mobile, inline on desktop */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-3">
        {marketPrice > 0 && marketPrice > currentPrice && (
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold text-gray-400">M.R.P.:</span>
            <span className="text-base text-gray-400 line-through sm:text-lg">
              ₹{marketPrice.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 sm:text-3xl">
            ₹{currentPrice.toLocaleString()}
          </span>
          {discountPercentage > 0 && (
            <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full sm:text-sm">
              Save {discountPercentage}%
            </span>
          )}
        </div>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className={`text-sm font-medium ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stock > 0 ? 'In Stock' : 'Out of stock'}
        </span>
      </div>

      {/* Description */}
      {productDescription && productDescription.length > 0 && (
        <div className="space-y-3 text-sm text-gray-600 sm:text-base">
          <div 
            className="prose-sm prose max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: productDescription
                .replace(/<ul>/g, '<ul class="space-y-2 ml-4">')
                .replace(/<li>/g, '<li class="flex items-start gap-2"><span class="text-pink-500 mt-1">•</span><span>') 
            }}
          />
        </div>
      )}

      {/* Quantity and Add to Cart - Stack on mobile */}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
        {/* Quantity Selector */}
        <div className="flex items-center justify-center w-full border-2 border-gray-200 rounded-lg sm:justify-start sm:w-auto">
          <button
            onClick={() => setQuantity(Math.max(1, safeQuantity - 1))}
            className="flex-1 px-4 py-3 text-gray-600 transition-colors sm:px-3 sm:py-2 hover:bg-gray-100 sm:flex-none"
          >
            -
          </button>
          <span className="px-4 py-3 sm:py-2 font-medium text-gray-900 min-w-[3rem] text-center">{safeQuantity}</span>
          <button
            onClick={() => setQuantity(safeQuantity + 1)}
            className="flex-1 px-4 py-3 text-gray-600 transition-colors sm:px-3 sm:py-2 hover:bg-gray-100 sm:flex-none"
          >
            +
          </button>
        </div>

        {/* Add to Cart button - Full width on mobile */}
        <button 
          onClick={handleAddToCart}
          disabled={stock === 0}
          className="flex-1 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 sm:px-6 bg-gradient-to-r from-pink-600 to-pink-500 rounded-xl hover:from-pink-700 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed sm:text-base"
        >
          {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>

      {/* Cart Confirmation */}
      {isAddedToCart && (
        <div className="px-4 py-4 mt-4 border border-green-200 bg-green-50 rounded-xl">
          <div className="flex flex-col justify-between gap-2 mb-3 sm:flex-row sm:items-center">
            <p className="text-sm text-green-700 sm:text-base">
              {safeQuantity} {safeQuantity > 1 ? 'items' : 'item'} added to your cart
            </p>
            <Link 
              href="/cart" 
              className="text-sm font-medium text-center text-green-600 hover:text-green-800 sm:text-right"
            >
              View Cart ({safeTotalItems})
            </Link>
          </div>
          <Link 
            href="/cart" 
            className="block w-full py-3 text-sm font-semibold text-center text-white transition-colors duration-200 rounded-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 sm:text-base"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}

      {/* Service Info - Responsive grid */}
      <div className="pt-4 space-y-3 border-t border-gray-200 sm:pt-6 sm:space-y-4">
        {[
          { icon: Shield, text: "100% Authentic Products" },
          { icon: RefreshCw, text: "Easy 7 Days Returns" }
        ].map(({ icon: Icon, text }, index) => (
          <div key={index} className="flex items-center gap-3 text-gray-600">
            <Icon className="w-4 h-4 text-pink-500 sm:w-5 sm:h-5 shrink-0" />
            <span className="text-sm sm:text-base">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};