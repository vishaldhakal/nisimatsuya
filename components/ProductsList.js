import Image from "next/image";
import SectionHeader from "./SectionHeader";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Gentle Body Wash And Shampoo (500ml)",
    image: "/products/1.jpg",
    mrp: 679.0,
    price: 597.52,
    perUnit: "₹1.20/ml",
  },
  {
    id: 2,
    name: "Bravo Trio Travel System (Camden, Black)",
    image: "/products/2.jpg",
    mrp: 44990.0,
    price: 38241.5,
    perUnit: null,
  },
  {
    id: 3,
    name: "Baby Body Lotion (500ml)",
    image: "/products/3.jpeg",
    mrp: 679.0,
    price: 577.15,
    perUnit: "₹1.15/ml",
  },
  {
    id: 4,
    name: "Polly Easy Highchair (Pinguin, Blue)",
    image: "/products/4.webp",
    mrp: 16990.0,
    price: 16990.0,
    perUnit: null,
  },
];

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 text-gray-300 hover:text-pink-400 transition-colors duration-200"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.54 0-2.878.792-3.562 2.008C11.188 4.542 9.85 3.75 8.312 3.75 5.723 3.75 3.625 5.765 3.625 8.25c0 7.22 8.375 11.25 8.375 11.25s8.375-4.03 8.375-11.25z"
    />
  </svg>
);

const ProductsList = () => {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Most Loved Products" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="relative bg-white rounded-2xl shadow-lg flex flex-col items-center p-6 pt-8 transition-transform duration-200 hover:-translate-y-1"
            >
              {/* Heart Icon */}
              <button className="absolute top-4 left-4 bg-white rounded-full p-1 shadow hover:shadow-md">
                <HeartIcon />
              </button>
              {/* Product Image */}
              <div className="flex justify-center items-center mb-4 h-40 w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={140}
                  height={140}
                  className="object-contain h-36 w-auto mx-auto"
                />
              </div>
              {/* Product Name */}
              <h3 className="text-lg font-bold text-center text-gray-800 mb-2 min-h-[48px] flex items-center justify-center">
                {product.name}
              </h3>
              {/* Price Section */}
              <div className="text-center mb-4">
                <span className="text-xs text-gray-400 font-semibold mr-1">
                  M.R.P.:
                </span>
                <span className="text-sm text-gray-400 line-through mr-2">
                  ₹{product.mrp.toLocaleString()}
                </span>
                <span className="text-base text-black font-bold">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.perUnit && (
                  <span className="text-xs text-gray-400 ml-1">
                    ({product.perUnit})
                  </span>
                )}
              </div>
              {/* Add to Cart Button */}
              <button className="mt-auto w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200">
                Add to Cart
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
