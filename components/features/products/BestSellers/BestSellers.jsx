"use client";

import { useState, useEffect } from "react";
import ProductCard from "../ProductCard/ProductCard";
import { fetchProducts } from "../../../../services"; 
import SectionHeader from "../../../common/SectionHeader/SectionHeader";
export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(Array.isArray(data) ? data.slice(0, 6) : []); 
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Our Best Sellers" />
          <div className="text-center py-12 text-gray-400">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader title="Our Best Sellers" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}