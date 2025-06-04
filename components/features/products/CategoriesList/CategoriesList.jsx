"use client";
import { useCategories } from "../../../../contexts/CategoriesContext";

export default function CategoriesList() {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-500">Error loading categories: {error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
      {categories.map((cat) => (
        <div key={cat.id} className="category-card">
          <span>{cat.name}</span>
        </div>
      ))}
    </div>
  );
}