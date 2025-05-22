"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "./Cart/CartContext";
import { useState, useEffect } from "react";

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-300 hover:text-pink-400 transition-colors duration-200"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.54 0-2.878.792-3.562 2.008C11.188 4.542 9.85 3.75 8.312 3.75 5.723 3.75 3.625 5.765 3.625 8.25c0 7.22 8.375 11.25 8.375 11.25s8.375-4.03 8.375-11.25z"
    />
  </svg>
);

const ProductCard = ({ product, isSpecial = false }) => {
  const { addToCart, totalItems } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileCartButton, setShowMobileCartButton] = useState(false);

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
    
    // Add complete product data to cart
    addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      mrp: product.mrp,
      price: product.price,
      perUnit: product.perUnit,
      // Include a source property to track where the product came from (optional)
      source: product.source || "unknown"
    }, 1);
    
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 10000); // Extended timeout to give user time to see checkout button
  };

  return (
    <div 
      className={`relative ${isSpecial ? 'aspect-square' : ''} rounded-3xl overflow-hidden transition-all duration-300 ${isHovered ? 'shadow-lg scale-[1.02]' : 'shadow-md'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setShowMobileCartButton(true)}
    >
      <div className="absolute inset-0 rounded-3xl border-2 border-pink-100"></div>
      
      {badge && (
        <div className={`absolute z-10 top-3 left-3 px-2 py-1 text-xs font-bold rounded-full 
          ${badge.type === 'new' ? 'bg-orange-100 text-orange-600' : 
            badge.type === 'popular' ? 'bg-pink-100 text-pink-600' : 
            'bg-red-100 text-red-600'}`}
        >
          {badge.text}
        </div>
      )}

      <button className="absolute z-10 top-3 right-3 bg-white rounded-full p-1.5 shadow hover:shadow-md">
        <HeartIcon />
      </button>

      <Link href={`/products/${product.id}`} className="block h-full">
        <div className="relative bg-white h-full flex flex-col p-4">
          <div className="relative flex-1 flex items-center justify-center mb-3 p-2">
           <Image
            src={product.images?.[0]?.image} 
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
                  className="bg-white text-pink-600 rounded-full p-3 shadow-lg transform transition-transform duration-300 hover:scale-110"
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
            
            <div className="mt-2 flex flex-col">
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
              className="mt-3 w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white font-medium rounded-xl py-2 px-4 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          )}
          
          {/* Confirmation after adding to cart */}
          {isAddedToCart && (
            <div className="absolute bottom-0 left-0 right-0 bg-green-50 px-3 py-3 text-center flex flex-col gap-2">
              <div className="text-green-800 text-xs">
                Added to cart ✓
              </div>
              <Link 
                href="/cart" 
                onClick={(e) => e.stopPropagation()} 
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg py-2 transition-colors duration-200"
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
            className="bg-gradient-to-r from-pink-600 to-pink-500 text-white font-medium rounded-full py-3 px-6 shadow-lg flex items-center gap-2"
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