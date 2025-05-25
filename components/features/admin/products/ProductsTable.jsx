"use client";
import Link from 'next/link';
import { ArrowUpDown, Edit, Trash2, Package } from 'lucide-react';
import { ProductsActions } from './ProductsActions';
import { formatPrice, getStockStatus, getCategoryName } from './productsUtils';

export const ProductsTable = ({ 
  products, 
  categories, 
  sortConfig, 
  handleSort, 
  showDeleteConfirm, 
  confirmDelete, 
  cancelDelete 
}) => {
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    return sortConfig.direction === 'ascending' 
      ? <ArrowUpDown className="w-4 h-4 ml-1 text-blue-500" /> 
      : <ArrowUpDown className="w-4 h-4 ml-1 text-blue-500 transform rotate-180" />;
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
            <div className="flex items-center">Product {getSortIcon('name')}</div>
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
            <div className="flex items-center">Price {getSortIcon('price')}</div>
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('stock')}>
            <div className="flex items-center">Stock {getSortIcon('stock')}</div>
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.stock);
          return (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                    {product.images?.length > 0 ? (
                      <img
                        className="h-10 w-10 object-cover"
                        src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0].image}`}
                        alt={product.name}
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 flex items-center justify-center text-gray-500">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <Link
                      href={`/admin/products/edit?id=${product.id}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {product.name}
                    </Link>
                    {product.description && (
                      <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getCategoryName(product.category, categories)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatPrice(product.price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex items-center">
                  <div className={`h-2.5 w-2.5 rounded-full bg-${stockStatus.color}-500 mr-2`}></div>
                  <span>{product.stock || 0}</span>
                  <span className={`ml-2 text-xs text-${stockStatus.color}-600`}>
                    {stockStatus.text}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <ProductsActions 
                  productId={product.id}
                  showDeleteConfirm={showDeleteConfirm}
                  confirmDelete={confirmDelete}
                  cancelDelete={cancelDelete}
                  editHref={`/admin/products/edit?id=${product.id}`}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};