"use client";
import { useState, useEffect } from 'react';
import { 
  ProductsHeader,
  ProductsSearch,
  ProductsTable,
  ProductsCard,
  ProductsEmptyState,
} from '../../../components/features/admin/products';
import { fetchProducts, fetchCategories } from '../../../services';
import { ArrowUpDown  , RefreshCw} from 'lucide-react';

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
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    Promise.all([fetchProducts(), fetchCategories()])
      .then(([productsData, categoriesData]) => {
        setProducts(Array.isArray(productsData) ? productsData : []);
        setFilteredProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    let results = [...products];
    if (searchTerm) {
      results = results.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
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
      return sortConfig.direction === 'ascending' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
    setFilteredProducts(results);
  }, [products, searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    setFilteredProducts(filteredProducts.filter(p => p.id !== id));
    setShowDeleteConfirm(null);
    setActiveDropdown(null);
  };

  const confirmDelete = (id) => {
    setShowDeleteConfirm(id);
    setActiveDropdown(null);
  };
  
  const cancelDelete = () => setShowDeleteConfirm(null);
  const toggleDropdown = (productId) => setActiveDropdown(prev => prev === productId ? null : productId);

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
        <ProductsHeader onRefresh={loadData} />
        <ProductsSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredProducts.length > 0 ? (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <ProductsTable 
                  products={filteredProducts}
                  categories={categories}
                  sortConfig={sortConfig}
                  handleSort={handleSort}
                  showDeleteConfirm={showDeleteConfirm}
                  confirmDelete={confirmDelete}
                  cancelDelete={cancelDelete}
                />
              </div>

              <div className="lg:hidden">
                <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {['name', 'price', 'stock'].map(key => (
                      <button
                        key={key}
                        onClick={() => handleSort(key)}
                        className={`flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                          sortConfig.key === key 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)} 
                        {sortConfig.key === key && <ArrowUpDown className="w-3 h-3 ml-1" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredProducts.map(product => (
                    <ProductsCard
                      key={product.id}
                      product={product}
                      categories={categories}
                      showDeleteConfirm={showDeleteConfirm}
                      confirmDelete={confirmDelete}
                      cancelDelete={cancelDelete}
                      activeDropdown={activeDropdown}
                      toggleDropdown={toggleDropdown}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <ProductsEmptyState 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />
          )}
        </div>
      </div>

      {activeDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
}