
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
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Search</h2>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
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
        <h2 className="text-lg font-semibold mb-4">Price Range</h2>
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
              className="w-1/2 border border-gray-300 rounded-lg p-2"
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
              className="w-1/2 border border-gray-300 rounded-lg p-2"
              placeholder="Max"
            />
          </div>
          <div className="text-sm text-gray-600 flex justify-between">
            <span>₹{priceRange.min}</span>
            <span>₹{priceRange.max}</span>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleApplyFilters}
          className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-pink-700 hover:to-pink-600 transition-colors duration-200"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClearAll}
          className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Clear All
        </button>
      </div>
    </div>
  );
}