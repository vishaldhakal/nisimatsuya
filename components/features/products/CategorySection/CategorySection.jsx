"use client";
import { useCategories } from "../../../../hooks/useCategories";
import CategoryCard from "../CategoryCard/CategoryCard";
import { SectionHeader } from "../../../common";

export default function CategorySection() {
  const { filteredCategories, loading } = useCategories();

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl">
          <SectionHeader title="Shop By Category" />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
            
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 shadow bg-yellow-50 rounded-2xl animate-pulse"
              >
                <div className="w-24 h-24 mb-3 bg-gray-200 rounded-xl"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  
  }

  return (
    <section className="py-16 bg-white">
      <div className="px-4 mx-auto max-w-7xl">
        <SectionHeader title="Shop By Category" />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          {filteredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}