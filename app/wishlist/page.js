'use client';
import React from 'react';
import { useWishlist } from '../../hooks/useWishlist';
 
import LoadingSpinner from './components/LoadingSpinner';
import { Heart } from 'lucide-react';
import { ProductCard } from '@/components/features/products';


export default function WishlistPage() {
  const { 
    wishlist, 
    loading, 
    error,  
  } = useWishlist();

  // Function to transform wishlist data to match ProductCard expected format
  const transformWishlistItem = (wishlistItem) => {
    const { product } = wishlistItem;
    
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.price),
      mrp: parseFloat(product.market_price),
      thumbnail_image: product.thumbnail_image,
      source: "wishlist",
      // Transform images array to match ProductCard expectation
      images: [
        {
          image: product.thumbnail_image.replace(process.env.NEXT_PUBLIC_API_URL || '', '')
        }
      ],
      category: product.category,
      isNew: false, 
      isPopular: false, 
    };
  };
  console.log('Wishlist data:', wishlist);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
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
          <a 
            href="/products" 
            className="px-6 py-3 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Browse Products
          </a>
        </div>
      </div>
    );
  }

  

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          My Wishlist ({wishlist.length})
        </h1>
        
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlist.map((wishlistItem) => {
          const transformedProduct = transformWishlistItem(wishlistItem);
          
          return (
            <div key={wishlistItem.id} className="relative group">
           
              <ProductCard product={transformedProduct} className="cursor-pointer" />
              {/* Overlay buttons for wishlist actions */}
              <div className="absolute z-20 flex flex-col gap-2 transition-opacity duration-200 opacity-0 top-16 right-3 group-hover:opacity-100">
                
                
              </div>
            </div>
          );
        })}
      </div>

      {/* Alternative layout if you prefer a different approach */}
      {false && (
        <div className="space-y-4">
          {wishlist.map((wishlistItem) => {
            const { product } = wishlistItem;
            
            return (
              <div key={wishlistItem.id} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
                <img
                  src={product.thumbnail_image}
                  alt={product.name}
                  className="object-cover w-20 h-20 rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category.name}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{parseFloat(product.price).toLocaleString()}
                    </span>
                    {parseFloat(product.market_price) > parseFloat(product.price) && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{parseFloat(product.market_price).toLocaleString()}
                      </span>
                    )}
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