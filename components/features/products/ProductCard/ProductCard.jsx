
"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../cart/CartContext";
import { useState, useEffect , useRef} from "react";
import WishlistButton from '../../../../components/ui/WishlistButton';
import { useWishlistNotification } from '../../../../contexts/WishlistNotificationContext';
import FlyingCartAnimation from '../../cart/FlyingCartAnimation'

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
  const [flyingAnimation, setFlyingAnimation] = useState({
    isActive: false,
    startPosition: null,
    targetPosition: null
  });

  const addToCartButtonRef = useRef(null);
  const mobileAddToCartButtonRef = useRef(null);

  // Detect if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get cart icon position (you'll need to implement this based on your cart icon location)
  const getCartIconPosition = () => {
    // This should return the position of your cart icon
    // You might need to use a ref or context to get the actual cart icon position
    const cartIcon = document.querySelector('[data-cart-icon]'); // Add this data attribute to your cart icon
    if (cartIcon) {
      const rect = cartIcon.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
    // Fallback position (top right corner)
    return {
      x: window.innerWidth - 50,
      y: 20
    };
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get button position for animation
    const buttonElement = isMobile ? mobileAddToCartButtonRef.current : addToCartButtonRef.current;
    const buttonRect = buttonElement.getBoundingClientRect();
    const startPosition = {
      x: buttonRect.left + buttonRect.width / 2,
      y: buttonRect.top + buttonRect.height / 2
    };

    // Get cart icon position
    const targetPosition = getCartIconPosition();

    // Start flying animation
    setFlyingAnimation({
      isActive: true,
      startPosition,
      targetPosition
    });

    // Add to cart
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
    
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 10000);
  };

  const handleAnimationComplete = () => {
    setFlyingAnimation({
      isActive: false,
      startPosition: null,
      targetPosition: null
    });
  };

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

  const discountPercentage = product.discount;
  const marketPrice = product.market_price || product.mrp;
  const sellingPrice = product.price;

  return (
    <>
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
                src={getImageUrl(product.images?.[1]?.image || '/images/fallback.png')}
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
                    ref={addToCartButtonRef}
                    onClick={handleAddToCart}
                    className={`p-3 text-pink-600 transition-all duration-300 transform bg-white rounded-full shadow-lg hover:scale-110 ${
                      isAddedToCart ? 'bg-green-100 text-green-600 scale-110' : ''
                    }`}
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
                ref={mobileAddToCartButtonRef}
                onClick={handleAddToCart}
                className={`flex items-center justify-center w-full gap-2 px-4 py-2 mt-3 font-medium text-white rounded-xl transition-all duration-300 ${
                  isAddedToCart 
                    ? 'bg-green-500 scale-105' 
                    : 'bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600'
                }`}
              >
                <ShoppingCart size={16} />
                {isAddedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
            )}
          </div>
        </Link>
      </div>

      {/* Flying Cart Animation */}
      <FlyingCartAnimation
        isActive={flyingAnimation.isActive}
        startPosition={flyingAnimation.startPosition}
        targetPosition={flyingAnimation.targetPosition}
        onComplete={handleAnimationComplete}
        productImage={getImageUrl(product.images?.[1]?.image || '/images/fallback.png')}
      />
    </>
  );
};

export default ProductCard;