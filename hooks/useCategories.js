
"use client";
import { useState, useEffect } from "react";
import { fetchCategories, fetchProductsByCategory } from "../services/api/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoriesWithProducts() {
      try {
        setLoading(true);
        const cats = await fetchCategories();
        setCategories(cats || []);
        
        const filtered = [];
        for (const cat of cats || []) {
          try {
            const products = await fetchProductsByCategory(cat.slug);
            if (products && products.length > 0) {
              filtered.push(cat);
            }
          } catch (error) {
            console.warn(`Error fetching products for category ${cat.slug}:`, error);
            filtered.push(cat);
          }
        }
        setFilteredCategories(filtered);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
        setFilteredCategories([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadCategoriesWithProducts();
  }, []);

  return { categories, filteredCategories, loading };
}