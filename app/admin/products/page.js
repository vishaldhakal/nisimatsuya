"use client";
import { useState, useEffect } from 'react';
import { 
  ProductsHeader,
  ProductsSearch,
  ProductsTable,
  ProductsCard,
  ProductsEmptyState,
} from '../../../components/features/admin/products';
import { deleteProduct } from '../../../services/api/productService';
import { useCategories } from '../../../contexts/CategoriesContext';
import { useProducts } from '../../../contexts/ProductsContext';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminProducts() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use contexts
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { products, loading: productsLoading, refreshProducts } = useProducts();

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

  // Handle categories error
  if (categoriesError) {
    toast.error('Failed to load categories. Some features may not work properly.');
  }

  const loadData = () => {
    refreshProducts();
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const getCategorySlug = (product, categories = []) => {
    if (product.category_slug) return product.category_slug;
    if (product.category && typeof product.category === 'object' && product.category.slug) return product.category.slug;
    if (product.category && typeof product.category === 'number' && categories.length > 0) {
      const found = categories.find(cat => cat.id === product.category);
      if (found) return found.slug;
    }
    console.error('Could not determine category slug for product:', product);
    return 'unknown';
  };

  const handleDeleteProduct = async (categoryOrProduct, maybeSlug) => {
    setIsDeleting(true);
    try {
      let category_slug, slug;
      if (typeof categoryOrProduct === 'object') {
        const product = categoryOrProduct;
        category_slug = getCategorySlug(product, categories);
        slug = product.slug;
      } else {
        category_slug = categoryOrProduct;
        slug = maybeSlug;
      }

      await deleteProduct(category_slug, slug);
      
      // Refresh products after successful deletion
      await refreshProducts();
      
      setShowDeleteConfirm(null);
      setActiveDropdown(null);
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = (id) => {
    if (isDeleting) return;
    setShowDeleteConfirm(id);
    setActiveDropdown(null);
  };
  
  const cancelDelete = () => setShowDeleteConfirm(null);
  const toggleDropdown = (productId) => setActiveDropdown(prev => prev === productId ? null : productId);

  if (productsLoading || categoriesLoading) {
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
