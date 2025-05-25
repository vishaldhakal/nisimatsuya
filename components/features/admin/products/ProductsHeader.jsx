"use client";
import Link from 'next/link';
import { Package, Plus, RefreshCw } from 'lucide-react';

export const ProductsHeader = ({ onRefresh }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
      <Package className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> 
      <span className="hidden sm:inline">Products Management</span>
      <span className="sm:hidden">Products</span>
    </h2>
    <div className="flex gap-2 w-full sm:w-auto">
      <Link 
        href="/admin/products/add" 
        className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm text-sm sm:text-base flex-1 sm:flex-none justify-center sm:justify-start"
      >
        <Plus className="w-4 h-4 mr-1 sm:mr-2" /> 
        <span className="hidden sm:inline">Add Product</span>
        <span className="sm:hidden">Add</span>
      </Link>
      <button 
        onClick={onRefresh}
        className="bg-white text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center border shadow-sm text-sm sm:text-base"
      >
        <RefreshCw className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:inline ml-2">Refresh</span>
      </button>
    </div>
  </div>
);