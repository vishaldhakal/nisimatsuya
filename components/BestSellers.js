"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";
import { fetchProducts } from "../services/productService"; 

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}