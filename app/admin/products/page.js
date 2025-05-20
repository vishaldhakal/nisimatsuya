"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter, 
  RefreshCw, 
  Tag,
  ArrowUpDown,
  Package,
  AlertCircle
} from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Simulate loading delay for data fetching
    setTimeout(() => {
      const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      setProducts(storedProducts);
      setFilteredProducts(storedProducts);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(storedProducts.map(p => p.category || 'Uncategorized'))];
      setCategories(['all', ...uniqueCategories]);
      
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    // Filter products based on search term and category
    let results = [...products];
    
    if (searchTerm) {
      results = results.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      results = results.filter(product => 
        (product.category || 'Uncategorized') === selectedCategory
      );
    }
    
    // Apply sorting
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
  }, [products, searchTerm, sortConfig, selectedCategory]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setShowDeleteConfirm(null);
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
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Package className="mr-2 h-6 w-6" /> Products Management
          </h2>
          <div className="flex gap-2">
            <Link href="/admin/products/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Link>
            <button 
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
                  setProducts(storedProducts);
                  setFilteredProducts(storedProducts);
                  setIsLoading(false);
                }, 300);
              }}
              className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center border shadow-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </button>
          </div>
        </div>
        
        {/* Search and filter */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative rounded-md flex items-center">
                <Filter className="h-5 w-5 text-gray-400 absolute left-3" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center">
                        Product {getSortIcon('name')}
                      </div>
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
                      Category
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
                              {product.image ? (
                                <img className="h-10 w-10 object-cover" src={product.image} alt={product.name} />
                              ) : (
                                <div className="h-10 w-10 bg-gray-200 flex items-center justify-center text-gray-500">
                                  <Package className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              {product.description && (
                                <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
                              )}
                            </div>
                          </div>
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
                          {product.category ? (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center w-fit">
                              <Tag className="h-3 w-3 mr-1" />
                              {product.category}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-xs">Uncategorized</span>
                          )}
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
          ) : (
            <div className="text-center py-12">
              <div className="flex flex-col items-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedCategory !== 'all' 
                    ? "Try adjusting your search or filter to find what you're looking for."
                    : "You haven't added any products yet. Get started by adding your first product."}
                </p>
                {searchTerm || selectedCategory !== 'all' ? (
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Clear filters
                  </button>
                ) : (
                  <Link href="/admin/products/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <Plus className="w-4 h-4 mr-2" /> Add First Product
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}