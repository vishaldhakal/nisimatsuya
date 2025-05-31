"use client";
import Link from 'next/link';
import { Package } from 'lucide-react';
import { ProductsActions } from './ProductsActions';
import { formatPrice, getStockStatus, getCategoryName } from './productsUtils';
import Image from 'next/image';

export const ProductsCard = ({ 
  product, 
  categories, 
  showDeleteConfirm, 
  confirmDelete, 
  cancelDelete,
  activeDropdown,
  toggleDropdown,
  onDelete,
  isDeleting
}) => {
  const stockStatus = getStockStatus(product.stock);
  
  // Helper function to get category slug
  const getCategorySlug = (product, categories) => {
    if (product.category_slug) {
      return product.category_slug;
    }
    // Fallback: find category slug by category ID
    const category = categories?.find(cat => cat.id === product.category);
    return category?.slug || 'unknown';
  };

  const categorySlug = getCategorySlug(product, categories);
  const editUrl = `/admin/products/edit?slug=${typeof product.slug === 'string' ? product.slug : product.slug.current}&category=${categorySlug}`;

  return (
    <div className="p-3 transition-colors sm:p-4 hover:bg-gray-50">
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className="flex-shrink-0 w-12 h-12 overflow-hidden rounded-lg sm:h-16 sm:w-16">
          {product.images?.length > 0 ? (
            <div className="relative w-full h-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0].image}`}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-200">
              <Package className="w-6 h-6 sm:h-8 sm:w-8" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <Link
                href={editUrl}
                className="block text-sm font-medium text-blue-600 truncate sm:text-base hover:underline"
              >
                {product.name}
              </Link>
              {product.description && (
                <div
                  className="mt-1 text-xs text-gray-500 sm:text-sm line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
            </div>

            <ProductsActions 
              product={product}
              categories={categories}
              showDeleteConfirm={showDeleteConfirm}
              confirmDelete={confirmDelete}
              cancelDelete={cancelDelete}
              editHref={editUrl}
              activeDropdown={activeDropdown}
              toggleDropdown={toggleDropdown}
              isMobile
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          </div>

          <div className="mt-2 space-y-1 sm:mt-3 sm:space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-4 sm:text-sm">
              <div className="flex items-center">
                <span className="mr-1 text-gray-500">Category:</span>
                <span className="text-gray-900">{getCategoryName(product.category, categories)}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1 text-gray-500">Price:</span>
                <span className="font-medium text-gray-900">{formatPrice(product.price)}</span>
              </div>
            </div>
            <div className="flex items-center text-xs sm:text-sm">
              <span className="mr-2 text-gray-500">Stock:</span>
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full bg-${stockStatus.color}-500 mr-2`}></div>
                <span className="mr-2 text-gray-900">{product.stock || 0}</span>
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