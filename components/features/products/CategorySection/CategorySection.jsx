"use client";
import { useCategories } from "../../../../hooks/useCategories";
import CategoryCard from "../CategoryCard/CategoryCard";
import { SectionHeader } from "../../../common";

export default function CategorySection() {
  const { filteredCategories, loading } = useCategories();

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Shop By Category" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-yellow-50 rounded-2xl shadow p-4 flex flex-col items-center animate-pulse"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-xl mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!filteredCategories || filteredCategories.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Shop By Category" />
          <div className="text-center py-8">
            <p className="text-gray-500">No categories available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader title="Shop By Category" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}