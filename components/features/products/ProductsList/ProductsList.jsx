"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "../ProductCard/ProductCard";
import SkeletonCard from "../SkeletonCard/SkeletonCard"; 
import { useProducts } from "../../../../contexts/ProductsContext";

export default function ProductsList() {
  const { products, loading } = useProducts();
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    // Filter products that are ONLY popular (not both popular and featured)
    const popular = products.filter(product => product.is_popular && !product.is_featured).slice(0, 6);
    setPopularProducts(popular);
  }, [products]);

  if (loading || popularProducts.length === 0) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Most Loved Products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
          </div>
          {!loading && popularProducts.length === 0 && (
            <div className="mt-8 text-center text-gray-500">
              No popular products available at the moment
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
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link 
            href="/products" 
            className="px-8 py-3 text-sm font-medium text-pink-600 transition-colors duration-200 border border-pink-600 rounded-lg hover:bg-pink-600 hover:text-white"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
}