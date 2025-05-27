"use client";
import { useState, useEffect } from "react";
import ProductCard from "../ProductCard/ProductCard";
import SkeletonCard from "../SkeletonCard/SkeletonCard"; // Adjust the import path as needed
import { fetchProducts } from "../../../../services";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);


  if (loading || products.length === 0) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Most Loved Products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Show 8 skeleton cards for a fuller appearance */}
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
          </div>
          {!loading && products.length === 0 && (
            <div className="mt-8 text-center text-gray-500">
              No products available at the moment
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Most Loved Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}