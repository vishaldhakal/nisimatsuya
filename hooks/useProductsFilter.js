"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchCategories, fetchProductsByCategory, fetchAllProducts, searchProducts } from "../services";

export const useProductsFilter = (initialCategory = "all") => {
  // Temporary states for user input (filters only)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [sortBy, setSortBy] = useState("featured");

  // Applied states - search updates in real-time, filters need button click
  const [searchQuery, setSearchQuery] = useState(""); // Real-time search
  const [appliedCategory, setAppliedCategory] = useState(initialCategory);
  const [appliedPriceRange, setAppliedPriceRange] = useState({ min: 0, max: 50000 });
  const [appliedSortBy, setAppliedSortBy] = useState("featured");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load categories on mount
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]));
  }, []);

  // Debounced search function
  const loadProducts = useCallback(async (searchTerm, category, priceRng) => {
    setLoading(true);
    try {
      let data = [];
      
      if (searchTerm && searchTerm.trim()) {
        // Use search API when there's a search query
        data = await searchProducts(searchTerm, priceRng, category);
      } else if (category === "all") {
        // Fetch all products when no search and category is "all"
        data = await fetchAllProducts(priceRng);
      } else {
        // Fetch products by category
        data = await fetchProductsByCategory(category, priceRng);
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load products when applied filters or search query changes
  useEffect(() => {
    loadProducts(searchQuery, appliedCategory, appliedPriceRange);
  }, [searchQuery, appliedCategory, appliedPriceRange, loadProducts]);

  // Update category when initial category changes (for URL-based navigation)
  useEffect(() => {
    setSelectedCategory(initialCategory);
    setAppliedCategory(initialCategory);
  }, [initialCategory]);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  // Apply filters (excluding search which is real-time)
  const handleApplyFilters = () => {
    setAppliedCategory(selectedCategory);
    setAppliedPriceRange(priceRange);
    setAppliedSortBy(sortBy);
  };

  // Clear all filters and search
  const handleClearAll = () => {
    // Reset temporary filter states
    setSelectedCategory("all");
    setPriceRange({ min: 0, max: 50000 });
    setSortBy("featured");
    
    // Reset applied states
    setSearchQuery("");
    setAppliedCategory("all");
    setAppliedPriceRange({ min: 0, max: 50000 });
    setAppliedSortBy("featured");
  };

  // Clear search only
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Filter and sort products based on current criteria
  const getFilteredAndSortedProducts = () => {
    let filteredProducts = [...products];

    // Sort products
    switch (appliedSortBy) {
      case "price-low":
        filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name-asc":
        filteredProducts.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name-desc":
        filteredProducts.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "featured":
      default:
        // Keep original order for featured, or sort by featured flag if available
        filteredProducts.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return 0;
        });
        break;
    }

    return filteredProducts;
  };

  return {
    // Filter states
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    
    // Applied states
    appliedCategory,
    appliedPriceRange,
    appliedSortBy,
    
    // Data
    categories,
    products: getFilteredAndSortedProducts(),
    loading,
    sortOptions,
    
    // Actions
    handleApplyFilters,
    handleClearAll,
    handleClearSearch,
  };
};