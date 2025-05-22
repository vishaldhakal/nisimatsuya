import { useEffect, useState } from "react";
import { fetchCategories } from "../services/categoryService";

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
      {categories.map((cat) => (
        <div key={cat.id} className="category-card">
          {/* Render your category card here */}
          <span>{cat.name}</span>
        </div>
      ))}
    </div>
  );
}