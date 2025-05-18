import CategoryCard from "./CategoryCard";
import SectionHeader from "./SectionHeader";

const categories = [
  {
    id: 1,
    name: "Baby Care",
    image: "/cats/1.jpg",
  },
  {
    id: 2,
    name: "Baby Toys",
    image: "/cats/2.jpg",
  },
  {
    id: 3,
    name: "Feeding & Nursing",
    image: "/cats/3.webp",
  },
  {
    id: 4,
    name: "Baby Furniture",
    image: "/cats/4.jpg",
  },
  {
    id: 5,
    name: "Baby Nursing",
    image: "/cats/5.webp",
  },
];

export default function CategorySection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader title="Shop By Category" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
