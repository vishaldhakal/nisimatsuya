"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Share2, Truck, Shield, RefreshCw, ChevronRight, Home, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../../../components/Cart/CartContext";
import ProductCard from "../../../components/ProductCard";

// Sample product data
const product = {
  id: 1,
  name: "Gentle Body Wash And Shampoo (500ml)",
  category: "Bath & Body",
  mrp: 679.0,
  price: 597.52,
  perUnit: "₹1.20/ml",
  description: "Gentle and nourishing body wash and shampoo specially formulated for babies.",
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
  ],
  specifications: {
    "Product Type": "Body Wash & Shampoo",
    Volume: "500ml",
    "Age Group": "0+ months",
  },
  isNew: false,
  isPopular: true,
};

// Related products
const relatedProducts = [
  {
    id: 3,
    name: "Baby Body Lotion (500ml)",
    image: "/products/3.jpeg",
    mrp: 679.0,
    price: 577.15,
    perUnit: "₹1.15/ml",
    isNew: false,
    isPopular: false
  },
  {
    id: 5,
    name: "Baby Powder (200g)",
    image: "/products/1.jpg",
    mrp: 299.0,
    price: 249.0,
    perUnit: "₹1.25/g",
    isNew: true,
    isPopular: false
  },
  {
    id: 7,
    name: "Baby Massage Oil (200ml)",
    image: "/products/4.webp",
    mrp: 399.0,
    price: 349.0,
    perUnit: "₹1.75/ml",
    isNew: false,
    isPopular: true
  },
];

const Badge = ({ type, text }) => {
  const getStyles = () => {
    switch (type) {
      case 'new':
        return 'bg-orange-100 text-orange-600';
      case 'popular':
        return 'bg-pink-100 text-pink-600';
      case 'discount':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyles()}`}>
      {text}
    </span>
  );
};

export default function EnhancedProductDetail() {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, totalItems } = useCart();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountPercentage = 
    product.mrp > product.price 
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
      : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      image: product.images[0],
      mrp: product.mrp,
      price: product.price,
      perUnit: product.perUnit
    }, quantity);
    setIsAddedToCart(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center">
                <Home className="w-4 h-4" />
              </Link>
            </li>
            <li><ChevronRight className="w-4 h-4 text-gray-400" /></li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-gray-700">
                Products
              </Link>
            </li>
            <li><ChevronRight className="w-4 h-4 text-gray-400" /></li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-3xl shadow-lg p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative rounded-3xl overflow-hidden border-2 border-pink-100 bg-white">
                {product.isNew && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge type="new" text="NEW" />
                  </div>
                )}
                {product.isPopular && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge type="popular" text="POPULAR" />
                  </div>
                )}
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge type="discount" text={`${discountPercentage}%`} />
                  </div>
                )}
                <div className="h-96 relative">
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    fill
                    className="object-contain p-6"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`relative h-24 rounded-xl overflow-hidden border-2 ${
                      selectedImage === image
                        ? "border-pink-500"
                        : "border-gray-200 hover:border-pink-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-xs text-gray-400 font-semibold">M.R.P.:</span>
                <span className="text-sm text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
                <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                {product.perUnit && (
                  <span className="text-sm text-gray-400">({product.perUnit})</span>
                )}
                {discountPercentage > 0 && (
                  <span className="ml-2 text-sm font-medium text-green-600">Save {discountPercentage}%</span>
                )}
              </div>

              <p className="text-gray-600">{product.description}</p>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Key Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-900 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-pink-700 hover:to-pink-600 transition-colors duration-200"
                >
                  Add to Cart
                </button>
                
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  <Heart 
                    className={`w-6 h-6 ${isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} 
                  />
                </button>
                
                <button className="p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50">
                  <Share2 className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {isAddedToCart && (
                <div className="mt-4 py-4 px-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-green-700">
                      {quantity} {quantity > 1 ? 'items' : 'item'} added to your cart
                    </p>
                    <Link 
                      href="/cart" 
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      View Cart ({totalItems})
                    </Link>
                  </div>
                  <Link 
                    href="/cart" 
                    className="block w-full bg-gradient-to-r from-green-600 to-green-500 text-white text-center font-semibold py-3 rounded-lg hover:from-green-700 hover:to-green-600 transition-colors duration-200"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Truck className="w-5 h-5 text-pink-500" />
                  <span>Free Delivery on orders above ₹499</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield className="w-5 h-5 text-pink-500" />
                  <span>100% Authentic Products</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <RefreshCw className="w-5 h-5 text-pink-500" />
                  <span>Easy 7 Days Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex border-b border-gray-100 py-2">
                  <span className="w-1/3 text-gray-600">{key}</span>
                  <span className="w-2/3 text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Related Products */}
          <div className="mt-16 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}