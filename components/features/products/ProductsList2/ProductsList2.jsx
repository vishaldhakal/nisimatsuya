"use client";

import { useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import { useCart } from "../../cart/CartContext";

const ProductsList2 = ({
  products = [], 
  loading = false
}) => {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState({});

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
  };

  if (loading) {
    return (
      <div className="py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 mx-auto text-center max-w-7xl">
        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
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