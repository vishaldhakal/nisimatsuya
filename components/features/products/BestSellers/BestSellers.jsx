"use client";
import { useState, useEffect } from "react";
import ProductCard from "../ProductCard/ProductCard";
import SkeletonCard from "../SkeletonCard/SkeletonCard"; 
import { fetchProducts } from "../../../../services";
import SectionHeader from "../../../common/SectionHeader/SectionHeader";

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(Array.isArray(data) ? data.slice(0, 4) : []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  // Show skeleton cards while loading or when no products available
  if (loading || products.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-6xl px-4 mx-auto">
          <SectionHeader title="Our Best Sellers" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Show 6 skeleton cards to match the expected layout */}
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
          </div>
          
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="px-4 mx-auto max-w-7xl">
        <SectionHeader title="Our Best Sellers" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}