import Image from "next/image";

export default function CategoryCard({ category }) {
  return (
    <div className="bg-yellow-50 rounded-2xl shadow p-4 flex flex-col items-center hover:shadow-lg transition cursor-pointer">
      <div className="w-24 h-24 relative mb-3">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover rounded-xl"
        />
      </div>
      <span className="text-md font-semibold text-gray-900">
        {category.name}
      </span>
    </div>
  );
}
