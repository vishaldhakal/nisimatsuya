"use client";
import Link from 'next/link';
import { Package, MoreVertical, X } from 'lucide-react';
import { ProductsActions } from './ProductsActions';
import { formatPrice, getStockStatus, getCategoryName } from './productsUtils';

export const ProductsCard = ({ 
  product, 
  categories, 
  showDeleteConfirm, 
  confirmDelete, 
  cancelDelete,
  activeDropdown,
  toggleDropdown
}) => {
  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className="flex-shrink-0 h-12 w-12 sm:h-16 sm:w-16 rounded-lg overflow-hidden">
          {product.images?.length > 0 ? (
            <img
              className="h-full w-full object-cover"
              src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0].image}`}
              alt={product.name}
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
              <Package className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <Link
                href={`/admin/products/edit?id=${product.id}`}
                className="text-sm sm:text-base font-medium text-blue-600 hover:underline block truncate"
              >
                {product.name}
              </Link>
              {product.description && (
                <div
                  className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
            </div>

            <ProductsActions 
              productId={product.id}
              showDeleteConfirm={showDeleteConfirm}
              confirmDelete={confirmDelete}
              cancelDelete={cancelDelete}
              editHref={`/admin/products/edit?id=${product.id}`}
              activeDropdown={activeDropdown}
              toggleDropdown={toggleDropdown}
              isMobile
            />
          </div>

          <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">Category:</span>
                <span className="text-gray-900">{getCategoryName(product.category, categories)}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">Price:</span>
                <span className="text-gray-900 font-medium">{formatPrice(product.price)}</span>
              </div>
            </div>
            <div className="flex items-center text-xs sm:text-sm">
              <span className="text-gray-500 mr-2">Stock:</span>
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full bg-${stockStatus.color}-500 mr-2`}></div>
                <span className="text-gray-900 mr-2">{product.stock || 0}</span>
                <span className={`text-${stockStatus.color}-600 text-xs`}>
                  {stockStatus.text}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};