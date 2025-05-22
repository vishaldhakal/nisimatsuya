"use client";

import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";
import { useCart } from "./Cart/CartContext";

const products = [
  {
    id: 1,
    name: "Musical Kids Hopping Horse Toy",
    desc: "Fun & Safe Ride for Kids",
    price: 500,
    mrp: 699, 
    perUnit: "per item", 
    inStock: 10,
    image: "/1.webp",
    isPopular: true, 
  },
  {
    id: 2,
    name: "10 Pcs Baby Grooming Kit",
    desc: "Healthcare Kit Set",
    price: 600,
    mrp: 799, 
    perUnit: "per set", 
    inStock: 42,
    image: "/2.jpg",
    isNew: true, 
  },
  {
    id: 3,
    name: "Soft Fabric Baby Clothes Rompers",
    desc: "Comfortable & Stylish",
    price: 700,
    mrp: 799,
    perUnit: "per piece", 
    inStock: 24,
    image: "/3.jpg",
  },
];

export default function BestSellers() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader title="Our Best Sellers" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}