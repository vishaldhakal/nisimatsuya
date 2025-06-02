"use client";
import Image from "next/image";
import { Search, Baby, Gift, Truck, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCategories } from "../../../services";
import Link from "next/link";
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
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-yellow-50 to-pink-50 min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background pattern */}
      {/* <BackgroundPattern /> */}

      {/* Blob decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 bg-pink-200 rounded-full w-80 h-80 mix-blend-multiply filter blur-3xl opacity-30"></div>

      {/* Content container */}
      <div className="relative z-10 max-w-6xl px-4 py-5 mx-auto text-center">
        <div className="flex flex-col items-center justify-between gap-8">
          {/* Left side - Image */}
          <div className="md:w-1/2">
            <div className="relative">
              <div>
                <Image
                  src="/images/ui/hero.png"
                  alt="Happy baby with teddy bear"
                  width={500}
                  height={500}
                  className="rounded-full"
                  priority
                />
              </div>
              {/* Trust badge */}
              <div className="absolute p-2 bg-white rounded-full shadow-lg -bottom-4 -right-4">
                <div className="flex items-center gap-1 px-4 py-2 bg-yellow-400 rounded-full">
                  <span className="text-sm font-normal text-black">
                    Trusted by Moms
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="text-left">
            <h1 className="mb-4 text-4xl font-extrabold text-center text-gray-900 md:text-6xl drop-shadow-lg">
              Baby's All in One Store{" "}
              <span className="text-pink-600">Nishimatsuya</span>
            </h1>
            <p className="mb-6 text-lg text-center text-gray-700">
              Premium quality baby products at affordable prices, trusted by
              families across Japan since 1972.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="relative mb-8">
              <input
                type="text"
                placeholder="Search for baby products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="w-full h-20 px-6 py-4 pl-12 pr-16 bg-white border-2 border-pink-200 rounded-full shadow-md focus:border-pink-500 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute p-3 text-white transition-colors duration-200 transform -translate-y-1/2 bg-pink-500 rounded-full right-2 top-1/2 hover:bg-pink-600"
                disabled={!searchQuery.trim()}
              >
                <Search size={20} />
              </button>
              <Search
                className="absolute text-pink-500 transform -translate-y-1/2 left-4 top-1/2"
                size={20}
              />
            </form>

            {/* Category icons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8 md:justify-center">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products/category/${category.slug}`}
                  className="flex flex-row items-center gap-1 p-3 transition-all bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-pink-50 hover:scale-105"
                >
                  <div className="p-2 text-pink-600 rounded-full bg-pink-50">
                    {categoryIcons[category.name?.toLowerCase()] || (
                      <Star size={24} />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}