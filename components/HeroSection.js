"use client";
import Image from "next/image";
import { Search, Baby, Gift, Truck, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchCategories } from "../services/categoryService";

// Optional: Map category names to icons
const categoryIcons = {
  clothing: <Baby size={24} />,
  toys: <Gift size={24} />,
  accessories: <Star size={24} />,
  gear: <Truck size={24} />,
};

// Background pattern SVG component
const BackgroundPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-10"
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
  >
    <defs>
      <pattern
        id="baby-pattern"
        x="0"
        y="0"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <path d="M10,10 L20,0 L20,20 Z" fill="#EC4899" />
        <circle cx="5" cy="5" r="3" fill="#F59E0B" />
        <circle cx="15" cy="15" r="2" fill="#EC4899" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#baby-pattern)" />
  </svg>
);

export default function HeroSection() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]));
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-yellow-50 to-pink-50 min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background pattern */}
      {/* <BackgroundPattern /> */}

      {/* Blob decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      {/* Content container */}
      <div className="relative z-10 max-w-6xl mx-auto text-center py-5 px-4">
        <div className="flex flex-col items-center justify-between gap-8">
          {/* Left side - Image */}
          <div className="md:w-1/2">
            <div className="relative">
              <div>
                <Image
                  src="/hero.png"
                  alt="Happy baby with teddy bear"
                  width={500}
                  height={500}
                  className="rounded-full"
                  priority
                />
              </div>
              {/* Trust badge */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-2 shadow-lg">
                <div className="bg-yellow-400 rounded-full px-4 py-2 flex items-center gap-1">
                  <span className="font-normal text-black text-sm">
                    Trusted by Moms
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 drop-shadow-lg text-center">
              Baby's All in One Store{" "}
              <span className="text-pink-600">Nishimatsuya</span>
            </h1>
            <p className="text-lg text-gray-700 mb-6 text-center">
              Premium quality baby products at affordable prices, trusted by
              families across Japan since 1972.
            </p>

            {/* Search bar */}
            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Search for baby products..."
                className="w-full px-6 h-20 py-4 pl-12 bg-white rounded-full border-2 border-pink-200 focus:border-pink-500 focus:outline-none shadow-md"
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-500"
                size={20}
              />
            </div>

            {/* Category icons */}
            <div className="flex flex-wrap justify-center md:justify-center gap-4 mb-8">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="flex flex-row gap-1 items-center p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-pink-50 hover:scale-105"
                >
                  <div className="bg-pink-50 rounded-full text-pink-600 p-2">
                    {categoryIcons[category.name?.toLowerCase()] || (
                      <Star size={24} />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
