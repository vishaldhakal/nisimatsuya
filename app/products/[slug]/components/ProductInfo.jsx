import React, { useState, useEffect } from 'react';
import { Share2, Truck, Shield, RefreshCw, Heart, } from "lucide-react";
import Link from 'next/link';
export const  ProductInfo = ({ product, categories, quantity, setQuantity, handleAddToCart, isAddedToCart, totalItems }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const categoryName = categories.find(cat => String(cat.id) === String(product.category))?.name || product.category;
  const discountPercentage = product.market_price && product.market_price > product.price
    ? Math.round(((product.market_price - product.price) / product.market_price) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <p className="mt-1 text-sm text-gray-500">{categoryName}</p>
      </div>

      <div className="flex items-baseline gap-3">
        {product.market_price && product.market_price > product.price && (
          <>
            <span className="text-xs font-semibold text-gray-400">M.R.P.:</span>
            <span className="text-lg text-gray-400 line-through">₹{product.market_price.toLocaleString()}</span>
          </>
        )}
        <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
        {discountPercentage > 0 && (
          <span className="px-2 py-1 ml-2 text-sm font-medium text-green-600 bg-green-100 rounded-full">
            Save {discountPercentage}%
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>
      </div>

      {/* Description */}
      {product.description && (
        <div className="space-y-3 text-gray-600">
          <div 
            className="prose-sm prose max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: product.description
                .replace(/<ul>/g, '<ul class="space-y-2 ml-4">')
                .replace(/<li>/g, '<li class="flex items-start gap-2"><span class="text-pink-500 mt-1">•</span><span>') 
            }}
          />
        </div>
      )}

      {/* Quantity and Add to Cart */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border-2 border-gray-200 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100"
          >
            -
          </button>
          <span className="px-4 py-2 font-medium text-gray-900">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100"
          >
            +
          </button>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 px-6 py-3 font-semibold text-white transition-colors duration-200 bg-gradient-to-r from-pink-600 to-pink-500 rounded-xl hover:from-pink-700 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <button 
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="p-3 transition-colors border-2 border-gray-200 rounded-xl hover:bg-gray-50"
        >
          <Heart 
            className={`w-6 h-6 ${isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} 
          />
        </button>
        <button className="p-3 transition-colors border-2 border-gray-200 rounded-xl hover:bg-gray-50">
          <Share2 className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {/* Cart Confirmation */}
      {isAddedToCart && (
        <div className="px-4 py-4 mt-4 border border-green-200 bg-green-50 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <p className="text-green-700">
              {quantity} {quantity > 1 ? 'items' : 'item'} added to your cart
            </p>
            <Link 
              href="/cart" 
              className="text-sm font-medium text-green-600 hover:text-green-800"
            >
              View Cart ({totalItems})
            </Link>
          </div>
          <Link 
            href="/cart" 
            className="block w-full py-3 font-semibold text-center text-white transition-colors duration-200 rounded-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}

      {/* Service Info */}
      <div className="pt-6 space-y-4 border-t border-gray-200">
        {[
          { icon: Truck, text: "Free Delivery on orders above ₹499" },
          { icon: Shield, text: "100% Authentic Products" },
          { icon: RefreshCw, text: "Easy 7 Days Returns" }
        ].map(({ icon: Icon, text }, index) => (
          <div key={index} className="flex items-center gap-3 text-gray-600">
            <Icon className="w-5 h-5 text-pink-500" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};