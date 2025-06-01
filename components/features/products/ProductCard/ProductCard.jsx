"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../cart/CartContext";
import { useWishlistToggle } from "../../../../hooks/useWishlist";
import { useState, useEffect } from "react";

const HeartIcon = ({ isInWishlist, onToggle, loading }) => (
  <button 
    onClick={onToggle}
    disabled={loading}
    className={`transition-all duration-200 ${loading ? 'animate-pulse' : ''}`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={isInWishlist ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`w-5 h-5 transition-colors duration-200 ${
        isInWishlist 
          ? 'text-pink-500' 
          : 'text-gray-300 hover:text-pink-400'
      }`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.54 0-2.878.792-3.562 2.008C11.188 4.542 9.85 3.75 8.312 3.75 5.723 3.75 3.625 5.765 3.625 8.25c0 7.22 8.375 11.25 8.375 11.25s8.375-4.03 8.375-11.25z"
      />
    </svg>
  </button>
);

const ProductCard = ({ product, isSpecial = false }) => {
  const { addToCart } = useCart();
  
  // Use the new TanStack Query wishlist toggle hook
  const { 
    isInWishlist, 
    toggle: toggleWishlist, 
    isLoading: wishlistLoading,
    error: wishlistError 
  } = useWishlistToggle(product.id);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileCartButton, setShowMobileCartButton] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState('');

  // Detect if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show mobile cart button when scrolling on product
  useEffect(() => {
    if (!isMobile) return;
    
    const handleScroll = () => {
      setShowMobileCartButton(true);
      
      // Hide after 3 seconds of no scroll
      const timeout = setTimeout(() => {
        setShowMobileCartButton(false);
      }, 3000);
      
      return () => clearTimeout(timeout);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Clear wishlist message after 3 seconds
  useEffect(() => {
    if (wishlistMessage) {
      const timer = setTimeout(() => {
        setWishlistMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [wishlistMessage]);

  // Handle wishlist error display
  useEffect(() => {
    if (wishlistError) {
      setWishlistMessage(wishlistError.message || 'Wishlist error');
    }
  }, [wishlistError]);

  const getBadge = () => {
    if (product.isNew) {
      return { type: "new", text: "NEW" };
    } else if (product.isPopular) {
      return { type: "popular", text: "POPULAR" };
    } else if (product.mrp > product.price) {
      const discountPercentage = Math.round(((product.mrp - product.price) / product.mrp) * 100);
      return { type: "discount", text: `${discountPercentage}%` };
    }
    return null;
  };

  const badge = getBadge();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      mrp: product.mrp,
      thumbnail_image: product.thumbnail_image,
      price: product.price,
      perUnit: product.perUnit,
      source: product.source || "unknown"
    }, 1);
    
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 10000);
  };

  // Handle wishlist toggle with TanStack Query
  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await toggleWishlist();
      
      if (isInWishlist) {
        setWishlistMessage('Removed from wishlist');
      } else {
        setWishlistMessage('Added to wishlist ❤️');
      }
    } catch (error) {
      setWishlistMessage(error.message || 'Please login to manage wishlist');
    }
  };

  return (
    <div 
      className={`relative ${isSpecial ? 'aspect-square' : ''} rounded-3xl overflow-hidden transition-all duration-300 ${isHovered ? 'shadow-lg scale-[1.02]' : 'shadow-md'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setShowMobileCartButton(true)}
    >
      <div className="absolute inset-0 border-2 border-pink-100 rounded-3xl"></div>
      
      {badge && (
        <div className={`absolute z-10 top-3 left-3 px-2 py-1 text-xs font-bold rounded-full 
          ${badge.type === 'new' ? 'bg-orange-100 text-orange-600' : 
            badge.type === 'popular' ? 'bg-pink-100 text-pink-600' : 
            'bg-red-100 text-red-600'}`}
        >
          {badge.text}
        </div>
      )}

      {/* Updated Heart Icon with TanStack Query */}
      <div className="absolute z-10 top-3 right-3 bg-white rounded-full p-1.5 shadow hover:shadow-md">
        <HeartIcon 
          isInWishlist={isInWishlist}
          onToggle={handleWishlistToggle}
          loading={wishlistLoading}
        />
      </div>

      {/* Wishlist feedback message */}
      {wishlistMessage && (
        <div className="absolute z-20 px-2 py-1 text-xs text-white bg-black rounded top-12 right-3 bg-opacity-80 animate-fade-in">
          {wishlistMessage}
        </div>
      )}
      
      <Link href={`/products/${typeof product.slug === 'string' ? product.slug : product.slug.current}`} className="block h-full">
        <div className="relative flex flex-col h-full p-4 bg-white">
          <div className="relative flex items-center justify-center flex-1 p-2 mb-3">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0].image}`}
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
              {product.mrp > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.mrp.toLocaleString()}
                </span>
              )}
              <span className="text-base font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
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
           
      
      {/* Mobile: Floating add to cart button (alternative approach) */}
      {false && isMobile && !isAddedToCart && (
        <div className={`fixed bottom-6 left-0 right-0 flex justify-center z-50 transition-opacity duration-300 ${showMobileCartButton ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-6 py-3 font-medium text-white rounded-full shadow-lg bg-gradient-to-r from-pink-600 to-pink-500"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;