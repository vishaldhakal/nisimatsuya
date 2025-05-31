"use client";
import Link from 'next/link';
import { Edit, Trash2, MoreVertical, X } from 'lucide-react';

export const ProductsActions = ({
  product, 
  categories = [], // Add default value
  showDeleteConfirm,
  confirmDelete,
  cancelDelete,
  editHref,
  activeDropdown,
  toggleDropdown,
  isMobile = false,
  onDelete,
  isDeleting = false
}) => {
  // Helper function to get category slug
  const getCategorySlug = (product, categories) => {
    if (product.category_slug) {
      return product.category_slug;
    }
    // Fallback: find category slug by category ID
    const category = categories?.find(cat => cat.id === product.category);
    return category?.slug || 'unknown';
  };

  const handleDeleteConfirm = async () => {
    try {
      const categorySlug = getCategorySlug(product, categories);
      
      // Call delete with both category_slug and slug
      await onDelete(categorySlug, product.slug);
    } catch (error) {
      console.error('Error deleting product:', error);
      // Error handling is done in the parent component (page.js)
    }
  };

  if (showDeleteConfirm === product.id) {
    return isMobile ? (
      <div className="flex items-center px-2 py-1 space-x-2 bg-white border border-gray-200 rounded-lg">
        <span className="text-xs text-gray-600">Delete?</span>
        <button 
          onClick={handleDeleteConfirm}
          disabled={isDeleting}
          className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Deleting...' : 'Yes'}
        </button>
        <button 
          onClick={cancelDelete} 
          disabled={isDeleting}
          className="text-xs text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    ) : (
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-600">Confirm?</span>
        <button 
          onClick={handleDeleteConfirm}
          disabled={isDeleting}
          className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Deleting...' : 'Yes'}
        </button>
        <button 
          onClick={cancelDelete} 
          disabled={isDeleting}
          className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="relative ml-2">
        <button
          onClick={() => toggleDropdown(product.id)}
          disabled={isDeleting}
          className="p-1 transition-colors rounded-full hover:bg-gray-100 disabled:opacity-50"
        >
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
        {activeDropdown === product.id && (
          <div className="absolute right-0 z-10 w-32 bg-white border border-gray-200 rounded-lg shadow-lg top-8">
            <Link
              href={editHref}
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-t-lg hover:bg-gray-100"
              onClick={() => toggleDropdown(null)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={() => confirmDelete(product.id)}
              disabled={isDeleting}
              className="flex items-center w-full px-3 py-2 text-sm text-left text-red-600 rounded-b-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex space-x-3">
      <Link href={editHref} className="flex items-center text-blue-600 hover:text-blue-900">
        <Edit className="w-4 h-4" />
      </Link>
      <button 
        onClick={() => confirmDelete(product.id)} 
        disabled={isDeleting}
        className="flex items-center text-red-600 hover:text-red-900 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};