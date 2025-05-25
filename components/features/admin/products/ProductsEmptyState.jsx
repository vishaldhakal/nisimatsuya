"use client";
import Link from 'next/link';
import { AlertCircle, RefreshCw, Plus } from 'lucide-react';

export const ProductsEmptyState = ({ searchTerm, setSearchTerm }) => (
  <div className="text-center py-8 sm:py-12 px-4">
    <div className="flex flex-col items-center">
      <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No products found</h3>
      <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4 max-w-md text-center">
        {searchTerm 
          ? "Try adjusting your search to find what you're looking for."
          : "You haven't added any products yet. Get started by adding your first product."}
      </p>
      {searchTerm ? (
        <button 
          onClick={() => setSearchTerm('')}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm sm:text-base"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Clear search
        </button>
      ) : (
        <Link 
          href="/admin/products/add" 
          className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 mr-2" /> Add First Product
        </Link>
      )}
    </div>
  </div>
);