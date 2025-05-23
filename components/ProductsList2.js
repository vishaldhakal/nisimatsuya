"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { fetchProducts } from "../services/productService";
import { useCart } from "../components/Cart/CartContext";


const ProductsList2 = ({
  searchQuery = "",
  category = "all",
  priceRange = { min: 0, max: 50000 },
  sortBy = "featured"
}) => {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState({});
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then(data => setAllProducts(Array.isArray(data) ? data : []))
      .catch(() => setAllProducts([]));
  }, []);

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      category === "all" ||
      (product.category && product.category === category);
    const matchesPrice =
      product.price >= priceRange.min && product.price <= priceRange.max;
    return matchesSearch && matchesCategory && matchesPrice;
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