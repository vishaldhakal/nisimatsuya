import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from "../../../../components/features/cart/CartContext";
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export const RelatedProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Early return if product is invalid
  if (!product || typeof product !== 'object') {
    console.warn('RelatedProductCard: Invalid product prop:', product);
    return null;
  }

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Ensure we have valid product data before adding to cart
    if (!product || !product.id) {
      console.error('Cannot add invalid product to cart:', product);
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name || 'Unnamed Product',
      image: product.images?.[0]?.image || product.image,
      thumbnail_image: product.thumbnail_image,
      mrp: product.market_price || product.mrp || 0,
      price: product.price || 0,
      perUnit: product.perUnit || 'piece'
    }, 1);

    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 5000);
  }, [addToCart, product]);

  // Safely extract values with fallbacks
  const productId = product.id || '';
  const productName = product.name || 'Unnamed Product';
  const productPrice = product.price || 0;
  const productMarketPrice = product.market_price || product.mrp || 0;
  const discountPercentage = product.discount || 0;

  // FIX: Handle slug properly - convert object to string if needed
  const getSlugString = (slug) => {
    if (typeof slug === 'string') return slug;
    if (typeof slug === 'object' && slug !== null) {
      // Handle Sanity-style slug objects
      return slug.current || slug.slug || slug._key || String(slug);
    }
    return productId ? String(productId) : 'product';
  };

  
  const productUrl = `/products/${typeof product.slug === 'string' ? product.slug : product.slug.current}}`;

  // Get image URL safely
  const getImageUrl = () => {
    if (product.images?.[0]?.image) {
      return `${process.env.NEXT_PUBLIC_API_URL}${product.images[0].image}`;
    }
    if (product.image) {
      return `${process.env.NEXT_PUBLIC_API_URL}${product.image}`;
    }
    return '/placeholder-product.jpg';
  };

  return (
    <div className="relative">
      <Link href={productUrl}>
        <div 
          className={`bg-white rounded-2xl border-2 border-pink-100 p-4 transition-all duration-300 cursor-pointer ${
            isHovered ? 'shadow-lg scale-[1.02]' : 'shadow-md'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {discountPercentage > 0 && (
            <div className="absolute z-10 px-2 py-1 text-xs font-bold text-red-600 bg-red-100 rounded-full top-2 left-2">
              {discountPercentage}%
            </div>
          )}

          <div className="relative flex items-center justify-center h-48 mb-4 overflow-hidden bg-gray-50 rounded-xl">
            <Image
              src={getImageUrl()}
              alt={productName}
              width={150}
              height={150}
              className={`object-contain max-h-40 transition-transform duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              onError={(e) => {
                e.target.src = '/placeholder-product.jpg';
              }}
            />
            
            {!isMobile && (
              <div 
                className={`absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <button
                  onClick={handleAddToCart}
                  className="p-2 text-pink-600 transition-transform duration-300 transform bg-white rounded-full shadow-lg hover:scale-110"
                  aria-label="Add to cart"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="mb-3">
            <h3 className="mb-2 text-sm font-medium text-gray-800 line-clamp-2">
              {productName}
            </h3>
            
            <div className="flex flex-col">
              {productMarketPrice && productMarketPrice > productPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{productMarketPrice.toLocaleString()}
                </span>
              )}
              <span className="text-lg font-bold text-gray-900">
                ₹{productPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {isMobile && (
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center w-full gap-2 px-4 py-2 font-medium text-white bg-gradient-to-r from-pink-600 to-pink-500 rounded-xl hover:from-pink-700 hover:to-pink-600"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          )}
        </div>
      </Link>

      {isAddedToCart && (
        <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-2 px-3 py-3 text-center border-2 border-t-0 border-green-200 bg-green-50 rounded-b-2xl">
          <div className="text-xs text-green-800">Added to cart ✓</div>
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
  );
};