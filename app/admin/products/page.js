"use client";
import { useState, useEffect } from 'react';
import { 
  ProductsHeader,
  ProductsSearch,
  ProductsTable,
  ProductsCard,
  ProductsEmptyState,
} from '../../../components/features/admin/products';
import { fetchCategories } from '../../../services/api/categoryService';
import { deleteProduct, fetchProducts } from '../../../services/api/productService';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Helper function to get category slug
  // Updated getCategorySlug function
const getCategorySlug = (product, categories) => {
  // First try to use the product's direct category_slug if available
  if (product.category_slug) {
    return product.category_slug;
  }
  
  // Fallback 1: Check if product.category is an object with slug (some APIs return expanded relations)
  if (product.category && typeof product.category === 'object' && product.category.slug) {
    return product.category.slug;
  }
  
  // Fallback 2: Find category by ID in the categories list
  const categoryId = product.category;
  if (categoryId && categories) {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) return category.slug;
  }
  
  // Final fallback: Return a safe default or throw an error
  console.error('Could not determine category slug for product:', product);
  return 'uncategorized'; // Or throw an error if you prefer
};

  // Updated delete function that accepts category_slug and slug parameters
  const handleDeleteProduct = async (category_slug, slug) => {
    setIsDeleting(true);
    try {
      // Call the API to delete the product
      await deleteProduct(category_slug, slug);
      
      // Update local state to remove the deleted product
      setProducts(prevProducts => 
        prevProducts.filter(p => !(p.slug === slug && getCategorySlug(p, categories) === category_slug))
      );
      setFilteredProducts(prevProducts => 
        prevProducts.filter(p => !(p.slug === slug && getCategorySlug(p, categories) === category_slug))
      );
      
      // Reset UI state
      setShowDeleteConfirm(null);
      setActiveDropdown(null);
      
      // Show success message
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = (id) => {
    if (isDeleting) return; // Prevent multiple delete attempts
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
    <div className="min-h-screen p-3 sm:p-4 lg:p-6 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <ProductsHeader onRefresh={loadData} />
        <ProductsSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          {filteredProducts.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <ProductsTable 
                  products={filteredProducts}
                  categories={categories}
                  sortConfig={sortConfig}
                  handleSort={handleSort}
                  showDeleteConfirm={showDeleteConfirm}
                  confirmDelete={confirmDelete}
                  cancelDelete={cancelDelete}
                  onDelete={handleDeleteProduct}
                  isDeleting={isDeleting}
                />
              </div>

              <div className="lg:hidden">
                <div className="p-3 border-b border-gray-200 sm:p-4 bg-gray-50">
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
                      onDelete={handleDeleteProduct}
                      isDeleting={isDeleting}
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