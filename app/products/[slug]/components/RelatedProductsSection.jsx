import React, { useState, useEffect } from 'react';
import { RelatedProductCard } from '../components';
import { fetchSimilarProducts } from '../../../../services/api/productService';
import Link from 'next/link';
import { ChevronRight, Loader2 } from 'lucide-react';

export const RelatedProductsSection = ({ product }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSimilarProducts = async () => {
      if (!product?.slug) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Use the product slug as required by your API endpoint
        const similarProducts = await fetchSimilarProducts(product.slug);
        
        // Ensure we have an array and filter out any invalid products
        const validProducts = Array.isArray(similarProducts) ? 
          similarProducts.filter(prod => prod && typeof prod === 'object' && prod.id) : [];
        
        setRelatedProducts(validProducts);
      } catch (err) {
        console.error('Error loading similar products:', err);
        setError(err.message);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadSimilarProducts();
  }, [product?.slug]);

  // Show loading state
  if (loading) {
    return (
      <div className="mt-16">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">You may also like</h2>
          <p className="text-gray-600">Discover more products you might enjoy</p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading similar products...</span>
        </div>
      </div>
    );
  }

  // Don't render if no products or error
  if (error || !relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <div className="mb-10 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">You may also like</h2>
        <p className="text-gray-600">Discover more products you might enjoy</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {relatedProducts.map((relatedProduct) => {
          // Add additional validation here
          if (!relatedProduct || typeof relatedProduct !== 'object' || !relatedProduct.id) {
            console.warn('Invalid product data:', relatedProduct);
            return null;
          }
          
          return (
            <RelatedProductCard 
              key={relatedProduct.id} 
              product={relatedProduct} 
            />
          );
        })}
      </div>
      
      <div className="mt-8 text-center">
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 px-8 py-3 font-semibold text-white transition-colors duration-200 bg-gradient-to-r from-pink-600 to-pink-500 rounded-xl hover:from-pink-700 hover:to-pink-600"
        >
          View All Products
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};