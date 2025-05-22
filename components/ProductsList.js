"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "../components/ProductCard";

const products = [
  {
    id: 5,
    name: "Gentle Body Wash And Shampoo (500ml)",
    image: "/products/1.jpg",
    mrp: 679.0,
    price: 597.52,
    perUnit: "₹1.20/ml",
    isNew: false,
    isPopular: false
  },
  {
    id: 6,
    name: "Bravo Trio Travel System (Camden, Black)",
    image: "/products/2.jpg",
    mrp: 44990.0,
    price: 38241.5,
    perUnit: null,
    isNew: true,
    isPopular: false
  },
  {
    id: 7,
    name: "Baby Body Lotion (500ml)",
    image: "/products/3.jpeg",
    mrp: 679.0,
    price: 577.15,
    perUnit: "₹1.15/ml",
    isNew: false,
    isPopular: true
  },
  {
    id: 8,
    name: "Polly Easy Highchair (Pinguin, Blue)",
    image: "/products/4.webp",
    mrp: 16990.0,
    price: 14990.0,
    perUnit: null,
    isNew: false,
    isPopular: false
  },
];

export default function ProductsList() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Most Loved Products</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}