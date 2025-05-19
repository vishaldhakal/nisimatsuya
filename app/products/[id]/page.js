"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Share2,
  Truck,
  Shield,
  RefreshCw,
  ChevronRight,
  Home,
} from "lucide-react";
import { useCart } from "../../../components/Cart/CartContext";
import toast from "react-hot-toast";

// Sample product data - Replace with your actual data fetching
const product = {
  id: 1,
  name: "Gentle Body Wash And Shampoo (500ml)",
  category: "Bath & Body",
  mrp: 679.0,
  price: 597.52,
  perUnit: "₹1.20/ml",
  description:
    "Gentle and nourishing body wash and shampoo specially formulated for babies. Made with natural ingredients, this 2-in-1 product cleanses and moisturizes your baby's delicate skin and hair.",
  images: [
    "/products/1.jpg",
    "/products/2.jpg",
    "/products/3.jpeg",
    "/products/4.webp",
  ],
  features: [
    "Hypoallergenic formula",
    "No harmful chemicals",
    "Suitable for daily use",
    "Tear-free formula",
    "Natural ingredients",
  ],
  specifications: {
    "Product Type": "Body Wash & Shampoo",
    Volume: "500ml",
    "Age Group": "0+ months",
    "Skin Type": "All skin types",
    "Country of Origin": "India",
  },
};

const relatedProducts = [
  {
    id: 2,
    name: "Baby Body Lotion (500ml)",
    mrp: 679.0,
    price: 577.15,
    perUnit: "₹1.15/ml",
    image: "/products/3.jpeg",
  },
  {
    id: 3,
    name: "Baby Shampoo (300ml)",
    mrp: 499.0,
    price: 449.0,
    perUnit: "₹1.50/ml",
    image: "/products/3.jpeg",
  },
  {
    id: 4,
    name: "Baby Oil (200ml)",
    mrp: 399.0,
    price: 359.0,
    perUnit: "₹1.80/ml",
    image: "/products/3.jpeg",
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

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      image: product.images[0],
      mrp: product.mrp,
      price: product.price,
      perUnit: product.perUnit
    }, quantity);
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 flex items-center"
              >
                <Home className="w-4 h-4" />
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li>
              <Link
                href="/products"
                className="text-gray-500 hover:text-gray-700"
              >
                Products
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-96 rounded-xl overflow-hidden">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`relative h-24 rounded-lg overflow-hidden ${
                      selectedImage === image
                        ? "ring-2 ring-pink-500"
                        : "hover:ring-2 hover:ring-gray-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-xs text-gray-400 font-semibold">
                  M.R.P.:
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.mrp.toLocaleString()}
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.perUnit && (
                  <span className="text-sm text-gray-400">
                    ({product.perUnit})
                  </span>
                )}
              </div>

              <p className="text-gray-600">{product.description}</p>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Key Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold py-3 rounded-lg hover:bg-pink-700 transition-colors duration-200"
                >
                  Add to Cart
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <HeartIcon />
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Share2 className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Truck className="w-5 h-5" />
                  <span>Free Delivery on orders above ₹499</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield className="w-5 h-5" />
                  <span>100% Authentic Products</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <RefreshCw className="w-5 h-5" />
                  <span>Easy 7 Days Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="w-1/3 text-gray-600">{key}</span>
                  <span className="w-2/3 text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-white rounded-2xl shadow-lg flex flex-col items-center p-6 pt-8 transition-transform duration-200 hover:-translate-y-1"
                >
                  <button className="absolute top-4 left-4 bg-white rounded-full p-1 shadow hover:shadow-md">
                    <HeartIcon />
                  </button>
                  <div className="flex justify-center items-center mb-4 h-40 w-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={140}
                      height={140}
                      className="object-contain h-36 w-auto mx-auto"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-center text-gray-800 mb-2 min-h-[48px] flex items-center justify-center">
                    {product.name}
                  </h3>
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
                  <button className="mt-auto w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}