"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { useProductsFilter } from "../../hooks/useProductsFilter";
import ProductsFilterSidebar from "../../components/common/ProductsFilterSidebar/ProductsFilterSidebar";
import MobileFilterPanel from "../../components/common/MobileFilterPanel/MobileFilterPanel";
import ProductsList2 from "../../components/features/products/ProductsList2/ProductsList2";

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchParams = useSearchParams();
  
  const {
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    
    // Applied states
    appliedCategory,
    appliedPriceRange,
    appliedSortBy,
    
    // Data
    categories,
    products,
    loading,
    sortOptions,
    
    // Actions
    handleApplyFilters,
    handleClearAll,
    handleClearSearch,
  } = useProductsFilter();

  // Handle search query from URL parameters
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search');
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [searchParams, setSearchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Search Results Header */}
        {searchQuery && (
          <div className="mb-6">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Search Results for "{searchQuery}"
            </h1>
            <p className="text-gray-600">
              {loading ? 'Searching...' : `Found ${products.length} products`}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <div className="flex-shrink-0 lg:w-80">
            <ProductsFilterSidebar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={categories}
              sortOptions={sortOptions}
              handleApplyFilters={handleApplyFilters}
              handleClearAll={handleClearAll}
              handleClearSearch={handleClearSearch}
            />
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 mb-4 bg-white border border-gray-300 rounded-lg lg:hidden"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>

          {/* Products Grid */}
          <div className="flex-1">
            <ProductsList2
              searchQuery={searchQuery}
              category={appliedCategory}
              priceRange={appliedPriceRange}
              sortBy={appliedSortBy}
              products={products}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <MobileFilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={categories}
        sortOptions={sortOptions}
        handleApplyFilters={handleApplyFilters}
        handleClearAll={handleClearAll}
        handleClearSearch={handleClearSearch}
      />
    </div>
  );
}