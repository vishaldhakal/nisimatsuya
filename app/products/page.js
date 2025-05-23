"use client";

import { useState, useEffect } from "react";
import ProductsList2 from "../../components/ProductsList2";
import { Search, Filter, X } from "lucide-react";
import { fetchCategories } from "../../services/categoryService";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]));
  }, []);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              {/* Search Bar */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Search</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                  <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Sort By</h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <div className="space-y-2">
                  <button
                    key="all"
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                      selectedCategory === "all"
                        ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Price Range</h2>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: e.target.value })
                    }
                    className="w-full accent-pink-500"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{priceRange.min}</span>
                    <span>₹{priceRange.max}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg mb-4"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>

          {/* Products Grid */}
          <div className="flex-1">
            <ProductsList2
              searchQuery={searchQuery}
              category={selectedCategory}
              priceRange={priceRange}
              sortBy={sortBy}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
                <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              </div>
            </div>

            {/* Mobile Sort */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Categories */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="space-y-2">
                <button
                  key="all"
                  onClick={() => {
                    setSelectedCategory("all");
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                    selectedCategory === "all"
                      ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price Range */}
            <div>
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="50000"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  className="w-full accent-pink-500"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{priceRange.min}</span>
                  <span>₹{priceRange.max}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
