
"use client";

import { Search, X, RotateCcw } from "lucide-react";

export default function ProductsFilterSidebar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  categories,
  sortOptions,
  handleApplyFilters,
  handleClearAll,
  handleClearSearch,
  onCategorySelect, 
}) {
  const handleCategoryClick = (categorySlug) => {
    setSelectedCategory(categorySlug);
    if (onCategorySelect) {
      onCategorySelect(categorySlug);
    }
  };

  return (
    <div className="sticky p-6 bg-white shadow-sm rounded-2xl top-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Search</h2>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
          <Search className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold">Sort By</h2>
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
        <h2 className="mb-4 text-lg font-semibold">Categories</h2>
        <div className="space-y-2">
          <button
            key="all"
            onClick={() => handleCategoryClick("all")}
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
              key={category.slug}
              onClick={() => handleCategoryClick(category.slug)}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                selectedCategory === category.slug
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
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold">Price Range</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="50000"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: Number(e.target.value) })
              }
              className="w-1/2 p-2 border border-gray-300 rounded-lg"
              placeholder="Min"
            />
            <input
              type="number"
              min="0"
              max="50000"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: Number(e.target.value) })
              }
              className="w-1/2 p-2 border border-gray-300 rounded-lg"
              placeholder="Max"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{priceRange.min}</span>
            <span>₹{priceRange.max}</span>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleApplyFilters}
          className="w-full px-6 py-3 font-semibold text-white transition-colors duration-200 bg-gradient-to-r from-pink-600 to-pink-500 rounded-xl hover:from-pink-700 hover:to-pink-600"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClearAll}
          className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-gray-700 transition-colors duration-200 bg-gray-100 rounded-xl hover:bg-gray-200"
        >
          <RotateCcw className="w-4 h-4" />
          Clear All
        </button>
      </div>
    </div>
  );
}