"use client";
import { useState, useEffect } from "react";
import ProductCard from "../ProductCard/ProductCard";
import SkeletonCard from "../SkeletonCard/SkeletonCard"; 
import { useProducts } from "../../../../contexts/ProductsContext";
import SectionHeader from "../../../common/SectionHeader/SectionHeader";

export default function BestSellers() {
  const { products, loading } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Filter products that are ONLY featured (not both featured and popular)
    const featured = products.filter(product => product.is_featured && !product.is_popular).slice(0, 4);
    setFeaturedProducts(featured);
  }, [products]);

  if (loading || featuredProducts.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-6xl px-4 mx-auto">
          <SectionHeader title="Our Best Sellers" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
          </div>
          {!loading && featuredProducts.length === 0 && (
            <div className="mt-8 text-center text-gray-500">
              No featured products available at the moment
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl">
        <SectionHeader title="Our Best Sellers" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}