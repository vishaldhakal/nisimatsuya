"use client";
import Link from 'next/link';
import { ArrowUpDown, Package } from 'lucide-react';
import { ProductsActions } from './ProductsActions';
import { formatPrice, getStockStatus, getCategoryName } from './productsUtils';
import Image from 'next/image';

export const ProductsTable = ({ 
  products, 
  categories, 
  sortConfig, 
  handleSort, 
  showDeleteConfirm, 
  confirmDelete, 
  cancelDelete,
  onDelete,
  isDeleting
}) => {
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    return sortConfig.direction === 'ascending' 
      ? <ArrowUpDown className="w-4 h-4 ml-1 text-blue-500" /> 
      : <ArrowUpDown className="w-4 h-4 ml-1 text-blue-500 transform rotate-180" />;
  };

  // Helper function to get category slug
  const getCategorySlug = (product, categories) => {
    if (product.category_slug) {
      return product.category_slug;
    }
    // Fallback: find category slug by category ID
    const category = categories?.find(cat => cat.id === product.category);
    return category?.slug || 'unknown';
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('name')}>
            <div className="flex items-center">Product {getSortIcon('name')}</div>
          </th>
          <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Category</th>
          <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('price')}>
            <div className="flex items-center">Price {getSortIcon('price')}</div>
          </th>
          <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('stock')}>
            <div className="flex items-center">Stock {getSortIcon('stock')}</div>
          </th>
          <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.stock);
          const categorySlug = getCategorySlug(product, categories);
          const editUrl = `/admin/products/edit?slug=${product.slug}&category=${categorySlug}`;
          
          return (
            <tr key={product.id} className="transition-colors hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 overflow-hidden rounded-md">
                    {product.images?.length > 0 ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0].image}`}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="object-cover rounded-full"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center w-10 h-10 text-gray-500 bg-gray-200">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <Link
                      href={editUrl}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {product.name}
                    </Link>
                   {product.description && (
                    <div className="max-w-md text-sm leading-relaxed text-gray-600 line-clamp-2">
                      {product.description.replace(/<[^>]*>/g, '')}
                    </div>
                  )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                {getCategoryName(product.category, categories)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                {formatPrice(product.price)}
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`h-2.5 w-2.5 rounded-full bg-${stockStatus.color}-500 mr-2`}></div>
                  <span>{product.stock || 0}</span>
                  <span className={`ml-2 text-xs text-${stockStatus.color}-600`}>
                    {stockStatus.text}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap">
                <ProductsActions 
                  product={product}
                  categories={categories}
                  showDeleteConfirm={showDeleteConfirm}
                  confirmDelete={confirmDelete}
                  cancelDelete={cancelDelete}
                  editHref={editUrl}
                  onDelete={onDelete}
                  isDeleting={isDeleting}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};