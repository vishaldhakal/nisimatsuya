"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  RefreshCw, 
  Package,
  AlertCircle,
  MoreVertical,
  X
} from 'lucide-react';
import { fetchProducts } from '../../../services/productService'; // 
import { fetchCategories } from '../../../services/categoryService'; // Add this import

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetchProducts()
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setFilteredProducts(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));

    // Fetch categories
    fetchCategories()
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let results = [...products];
    if (searchTerm) {
      results = results.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Sorting logic
    results.sort((a, b) => {
      if (sortConfig.key === 'price') {
        return sortConfig.direction === 'ascending' 
          ? parseFloat(a.price) - parseFloat(b.price)
          : parseFloat(b.price) - parseFloat(a.price);
      }
      if (sortConfig.key === 'stock') {
        return sortConfig.direction === 'ascending' 
          ? (a.stock || 0) - (b.stock || 0)
          : (b.stock || 0) - (a.stock || 0);
      }
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      if (sortConfig.direction === 'ascending') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
    setFilteredProducts(results);
  }, [products, searchTerm, sortConfig]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // You can implement API delete here if needed
  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
    setFilteredProducts(filteredProducts.filter(product => product.id !== id));
    setShowDeleteConfirm(null);
    setActiveDropdown(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const confirmDelete = (id) => {
    setShowDeleteConfirm(id);
    setActiveDropdown(null);
  };
  
  const cancelDelete = () => setShowDeleteConfirm(null);

  const getStockStatus = (stock) => {
    if (stock === undefined || stock === null) return { color: 'gray', text: 'Not tracked' };
    if (stock <= 0) return { color: 'red', text: 'Out of stock' };
    if (stock < 10) return { color: 'orange', text: 'Low stock' };
    return { color: 'green', text: 'In stock' };
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'ascending' 
      ? <ArrowUpDown className="w-4 h-4 ml-1 text-blue-500" /> 
      : <ArrowUpDown className="w-4 h-4 ml-1 text-blue-500 transform rotate-180" />;
  };

  // Helper to get category name by id
  const getCategoryName = (id) => {
    const cat = categories.find(c => String(c.id) === String(id));
    return cat ? cat.name : <span className="text-gray-400">-</span>;
  };

  const refreshProducts = () => {
    setIsLoading(true);
    fetchProducts()
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setFilteredProducts(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const toggleDropdown = (productId) => {
    setActiveDropdown(activeDropdown === productId ? null : productId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
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
              onClick={refreshProducts}
              className="bg-white text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center border shadow-sm text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline ml-2">Refresh</span>
            </button>
          </div>
        </div>
        
        {/* Search Section */}
        <div className="bg-white rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>
        
        {/* Products Content */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredProducts.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                        <div className="flex items-center">
                          Product {getSortIcon('name')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
                        <div className="flex items-center">
                          Price {getSortIcon('price')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('stock')}>
                        <div className="flex items-center">
                          Stock {getSortIcon('stock')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                  <img className="h-10 w-10 object-cover" src={product.images[0].image} alt={product.name} />
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
                            {getCategoryName(product.category)}
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
                            {showDeleteConfirm === product.id ? (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-600">Confirm?</span>
                                <button onClick={() => deleteProduct(product.id)} className="text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs">
                                  Yes
                                </button>
                                <button onClick={cancelDelete} className="text-gray-600 hover:text-gray-800 px-2 py-1 text-xs">
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex space-x-3">
                                <Link href={`/admin/products/edit?id=${product.id}`} className="text-blue-600 hover:text-blue-900 flex items-center">
                                  <Edit className="h-4 w-4" />
                                </Link>
                                <button onClick={() => confirmDelete(product.id)} className="text-red-600 hover:text-red-900 flex items-center">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden">
                {/* Sort Controls for Mobile */}
                <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSort('name')}
                      className={`flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                        sortConfig.key === 'name' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Name {sortConfig.key === 'name' && getSortIcon('name')}
                    </button>
                    <button
                      onClick={() => handleSort('price')}
                      className={`flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                        sortConfig.key === 'price' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Price {sortConfig.key === 'price' && getSortIcon('price')}
                    </button>
                    <button
                      onClick={() => handleSort('stock')}
                      className={`flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                        sortConfig.key === 'stock' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Stock {sortConfig.key === 'stock' && getSortIcon('stock')}
                    </button>
                  </div>
                </div>

                {/* Product Cards */}
                <div className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <div key={product.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0 h-12 w-12 sm:h-16 sm:w-16 rounded-lg overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img className="h-full w-full object-cover" src={product.images[0].image} alt={product.name} />
                            ) : (
                              <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                                <Package className="h-6 w-6 sm:h-8 sm:w-8" />
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
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
                                  <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                                )}
                              </div>

                              {/* Actions Dropdown */}
                              <div className="relative ml-2">
                                {showDeleteConfirm === product.id ? (
                                  <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-2 py-1">
                                    <span className="text-xs text-gray-600">Delete?</span>
                                    <button 
                                      onClick={() => deleteProduct(product.id)} 
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
                                  <>
                                    <button
                                      onClick={() => toggleDropdown(product.id)}
                                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                      <MoreVertical className="h-4 w-4 text-gray-500" />
                                    </button>
                                    {activeDropdown === product.id && (
                                      <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <Link
                                          href={`/admin/products/edit?id=${product.id}`}
                                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                                          onClick={() => setActiveDropdown(null)}
                                        >
                                          <Edit className="h-4 w-4 mr-2" />
                                          Edit
                                        </Link>
                                        <button
                                          onClick={() => confirmDelete(product.id)}
                                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg text-left"
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Product Details */}
                            <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                                <div className="flex items-center">
                                  <span className="text-gray-500 mr-1">Category:</span>
                                  <span className="text-gray-900">{getCategoryName(product.category)}</span>
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
                  })}
                </div>
              </div>
            </>
          ) : (
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
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
}