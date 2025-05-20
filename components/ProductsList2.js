"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../components/Cart/CartContext";
import { useState } from "react";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 9,
    name: "Gentle Body Wash And Shampoo (500ml)",
    image: "/products/1.jpg",
    mrp: 679.0,
    price: 597.52,
    perUnit: "₹1.20/ml",
    isNew: false,
    isPopular: false
  },
  {
    id: 10,
    name: "Bravo Trio Travel System (Camden, Black)",
    image: "/products/2.jpg",
    mrp: 44990.0,
    price: 38241.5,
    perUnit: null,
    isNew: true,
    isPopular: false
  },
  {
    id: 11,
    name: "Baby Body Lotion (500ml)",
    image: "/products/3.jpeg",
    mrp: 679.0,
    price: 577.15,
    perUnit: "₹1.15/ml",
    isNew: false,
    isPopular: true
  },
  {
    id: 12,
    name: "Polly Easy Highchair (Pinguin, Blue)",
    image: "/products/4.webp",
    mrp: 16990.0,
    price: 14990.0,
    perUnit: null,
    isNew: false,
    isPopular: false
  },
];

const ProductsList2 = ({ searchQuery = "", category = "all", priceRange = { min: 0, max: 50000 }, sortBy = "featured" }) => {
  const { addToCart, totalItems } = useCart();
  const [addedItems, setAddedItems] = useState({});

  // Filter products based on search, category and price range
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort products
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsList2;