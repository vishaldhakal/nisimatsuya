"use client";

import { useState, useEffect } from "react";
import ProductCard from "../ProductCard/ProductCard";
import { fetchAllProducts, fetchProductsByCategory } from "../../../../services";
import { useCart } from "../../cart/CartContext";

const ProductsList2 = ({
  searchQuery = "",
  category = "all",
  priceRange = { min: 0, max: 50000 },
  sortBy = "featured"
}) => {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let products;
        if (category === "all") {
          products = await fetchAllProducts(priceRange);
        } else {
          products = await fetchProductsByCategory(category, priceRange);
        }
        setAllProducts(Array.isArray(products) ? products : []);
      } catch (error) {
        console.error("Error loading products:", error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category, priceRange]);

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (sortedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-12 text-center">
        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
              added={!!addedItems[product.id]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsList2;