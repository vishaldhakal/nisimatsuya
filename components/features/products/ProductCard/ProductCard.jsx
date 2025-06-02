
"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../cart/CartContext";
import { useState, useEffect } from "react";
import WishlistButton from '../../../../components/ui/WishlistButton';
import { useWishlistNotification } from '../../../../context/WishlistNotificationContext';
const getImageUrl = (imageUrl) => {
  // If the image URL already starts with http/https, use it as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // Otherwise, prepend the API URL
  return `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`;
};
const ProductCard = ({ product, isSpecial = false }) => {
  const { addToCart } = useCart();
  const { showNotification } = useWishlistNotification();
  
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      mrp: product.mrp || product.market_price, // Support both field names
      thumbnail_image: product.thumbnail_image,
      price: product.price,
      perUnit: product.perUnit,
      source: product.source || "unknown"
    }, 1);
    
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 10000);
  };

  // Handle wishlist feedback
  const handleWishlistToggle = (wasInWishlist, productId) => {
    if (wasInWishlist) {
      showNotification('Removed from wishlist', 'info');
    } else {
      showNotification('Added to wishlist ❤️', 'success');
    }
  };

 
 

  const discountPercentage = product.discount;
  const marketPrice = product.market_price || product.mrp;
  const sellingPrice = product.price;

  return (
    <div 
      className={`relative ${isSpecial ? 'aspect-square' : ''} rounded-3xl overflow-hidden transition-all duration-300 ${isHovered ? 'shadow-lg scale-[1.02]' : 'shadow-md'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 border-2 border-pink-100 rounded-3xl"></div>
      
      {/* Badges Section */}
      <div className="absolute z-10 flex gap-2 top-3 left-3">
        {product.is_featured && (
          <span className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full">FEATURED</span>
        )}
        {product.is_popular && (
          <span className="px-2 py-1 text-xs font-medium text-pink-600 bg-pink-100 rounded-full">POPULAR</span>
        )}
        {product.isNew && (
          <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">NEW</span>
        )}
        
      </div>

      {/* Wishlist Button */}
      <div className="absolute z-10 top-3 right-3">
        <WishlistButton
          productId={product.id}
          size="sm"
          variant="default"
          className="shadow hover:shadow-md"
          onToggle={handleWishlistToggle}
        />
      </div>
      
      <Link href={`/products/${typeof product.slug === 'string' ? product.slug : product.slug.current}`} className="block h-full">
        <div className="relative flex flex-col h-full p-4 bg-white">
          <div className="relative flex items-center justify-center flex-1 p-2 mb-3">
            <Image
              src={getImageUrl(product.images[0].image)}
              alt={product.name}
              width={180}
              height={180}
              className="object-contain max-h-48"
            />
            
            {/* Desktop hover add to cart */}
            {!isMobile && (
              <div 
                className={`absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <button
                  onClick={handleAddToCart}
                  className="p-3 text-pink-600 transition-transform duration-300 transform bg-white rounded-full shadow-lg hover:scale-110"
                >
                  <ShoppingCart size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="px-2">
            <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
              {product.name}
            </h3>
            
            <div className="flex flex-col mt-2">
              {/* Show market price (crossed out) when it's higher than selling price */}
              {marketPrice && parseFloat(marketPrice) > parseFloat(sellingPrice) && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{parseFloat(marketPrice).toLocaleString('en-IN', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </span>
              )}
              {/* Current selling price and discount savings */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  ₹{parseFloat(sellingPrice).toLocaleString('en-IN', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </span>
                {/* Show discount savings on the right side */}
                {product.discount && parseFloat(product.discount) > 0 && (
                  <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md">
                    Save {parseFloat(product.discount)}%
                  </span>
                )}
              </div>
              {product.perUnit && (
                <span className="text-xs text-gray-400">
                  ({product.perUnit})
                </span>
              )}
            </div>
          </div>
          
          {/* Mobile: Always visible add to cart button */}
          {isMobile && (
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center w-full gap-2 px-4 py-2 mt-3 font-medium text-white bg-gradient-to-r from-pink-600 to-pink-500 rounded-xl"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          )}
          
          {/* Confirmation after adding to cart */}
          {isAddedToCart && (
            <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 px-3 py-3 text-center bg-green-50">
              <div className="text-xs text-green-800">
                Added to cart ✓
              </div>
              <Link 
                href="/cart" 
                onClick={(e) => e.stopPropagation()} 
                className="py-2 text-xs font-medium text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;