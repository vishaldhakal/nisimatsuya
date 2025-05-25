"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({ category }) {
  const [imgError, setImgError] = useState(false);
  
  const imageSource = `${process.env.NEXT_PUBLIC_API_URL}${category?.image}` || category.image;;
  if (!category) {
    return (
      <div className="bg-gray-100 rounded-2xl shadow p-4 flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center">
          <span className="text-gray-400 text-xs">No Category</span>
        </div>
        <span className="text-md font-semibold text-gray-900">Unknown Category</span>
      </div>
    );
  }
  return (
    <Link href={`/products/category/${category?.slug || category?.id}`}>
      <div className="bg-yellow-50 rounded-2xl shadow p-4 flex flex-col items-center hover:shadow-lg transition cursor-pointer">
        <div className="w-24 h-24 relative mb-3">
          {imageSource && !imgError ? (
            <Image
              src={imageSource}
              alt={category?.name || 'Category'}
              fill
              className="object-cover rounded-xl"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>
        <span className="text-md font-semibold text-gray-900">
          {category?.name || 'Unknown Category'}
        </span>
      </div>
    </Link>
  );
}