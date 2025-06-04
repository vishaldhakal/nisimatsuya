"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCategories } from '../services/api/categoryService';

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCategories();
        
        if (isMounted) {
          setCategories(data || []);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        if (isMounted) {
          setError(err.message);
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = {
    categories,
    filteredCategories: categories, // You can add filtering logic here if needed
    loading,
    error,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};