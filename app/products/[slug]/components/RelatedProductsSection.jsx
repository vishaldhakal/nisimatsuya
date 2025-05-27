import {RelatedProductCard} from '../components';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
export const RelatedProductsSection = ({ relatedProducts }) => {
  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="mb-10 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">You may also like</h2>
        <p className="text-gray-600">Discover more products you might enjoy</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {relatedProducts.map((relatedProduct) => (
          <RelatedProductCard key={relatedProduct.id} product={relatedProduct} />
        ))}
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