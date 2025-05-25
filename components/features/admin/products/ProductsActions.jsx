"use client";
import Link from 'next/link';
import { Edit, Trash2, MoreVertical, X } from 'lucide-react';

export const ProductsActions = ({
  productId,
  showDeleteConfirm,
  confirmDelete,
  cancelDelete,
  editHref,
  activeDropdown,
  toggleDropdown,
  isMobile = false
}) => {
  if (showDeleteConfirm === productId) {
    return isMobile ? (
      <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-2 py-1">
        <span className="text-xs text-gray-600">Delete?</span>
        <button 
          onClick={() => confirmDelete(productId)} 
          className="text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Yes
        </button>
        <button 
          onClick={cancelDelete} 
          className="text-gray-600 hover:text-gray-800 text-xs"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    ) : (
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-600">Confirm?</span>
        <button onClick={() => confirmDelete(productId)} className="text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs">
          Yes
        </button>
        <button onClick={cancelDelete} className="text-gray-600 hover:text-gray-800 px-2 py-1 text-xs">
          Cancel
        </button>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="relative ml-2">
        <button
          onClick={() => toggleDropdown(productId)}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </button>
        {activeDropdown === productId && (
          <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <Link
              href={editHref}
              className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
              onClick={() => toggleDropdown(null)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={() => confirmDelete(productId)}
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg text-left"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex space-x-3">
      <Link href={editHref} className="text-blue-600 hover:text-blue-900 flex items-center">
        <Edit className="h-4 w-4" />
      </Link>
      <button onClick={() => confirmDelete(productId)} className="text-red-600 hover:text-red-900 flex items-center">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};