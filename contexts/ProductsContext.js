"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchProducts as fetchProductsAPI } from '../services/api/productService';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Cache duration in milliseconds (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchProducts = useCallback(async (forceRefresh = false) => {
    // Skip if we have recent data and not forcing refresh
    if (!forceRefresh && products.length > 0 && lastFetchTime && 
        Date.now() - lastFetchTime < CACHE_DURATION) {
      return products;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchProductsAPI();
      const productsArray = Array.isArray(data) ? data : [];
      setProducts(productsArray);
      setLastFetchTime(Date.now());
      setLoading(false);
      return productsArray;
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      setLoading(false);
      return [];
    }
  }, [products, lastFetchTime]);

  // Initial fetch on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Helper functions for common operations
  const getProductBySlug = useCallback((slug) => {
    return products.find(product => product.slug === slug);
  }, [products]);

  const getProductById = useCallback((id) => {
    return products.find(product => product.id === parseInt(id));
  }, [products]);

  const getBestSellers = useCallback((limit = 4) => {
    return products
      .filter(product => product.is_popular || product.is_featured)
      .slice(0, limit);
  }, [products]);

  const getMostLoved = useCallback((limit = 6) => {
    return products.slice(0, limit);
  }, [products]);

  const getProductsByCategory = useCallback((categoryId) => {
    return products.filter(product => 
      product.category === categoryId || 
      (typeof product.category === 'object' && product.category?.id === categoryId)
    );
  }, [products]);

  const refreshProducts = useCallback(() => {
    return fetchProducts(true);
  }, [fetchProducts]);

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    refreshProducts,
    getProductBySlug,
    getProductById,
    getBestSellers,
    getMostLoved,
    getProductsByCategory,
    lastFetchTime
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};