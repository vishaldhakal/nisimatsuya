import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/1`}
      className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition"
    >
      <div className="w-32 h-32 relative mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-xl"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {product.name}
      </h3>
      <p className="text-gray-700 text-sm mb-2">{product.desc}</p>
      <div className="text-xs text-gray-500 mb-2">
        In-stock: {product.inStock}
      </div>
      <div className="text-xl font-bold text-pink-600 mb-4">
        Rs {product.price}
      </div>
      <button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-full transition">
        Buy now
      </button>
    </Link>
  );
}
