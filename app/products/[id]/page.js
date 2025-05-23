"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Share2, Truck, Shield, RefreshCw, ChevronRight, Home, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../../../components/Cart/CartContext";
import { fetchProductById, fetchProducts } from "../../../services/productService";
import { fetchCategories } from "../../../services/categoryService";

// Related Product Card Component
const RelatedProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Detect if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      image: product.images?.[0]?.image || product.image,
      mrp: product.market_price || product.mrp,
      price: product.price,
      perUnit: product.perUnit
    }, 1);

    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 5000);
  };

  const discountPercentage = product.market_price && product.market_price > product.price
    ? Math.round(((product.market_price - product.price) / product.market_price) * 100)
    : 0;

  return (
    <div className="relative">
      <Link href={`/products/${product.id}`}>
        <div 
          className={`bg-white rounded-2xl border-2 border-pink-100 p-4 transition-all duration-300 ${
            isHovered ? 'shadow-lg scale-[1.02]' : 'shadow-md'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold z-10">
              {discountPercentage}%
            </div>
          )}

          {/* Product Image */}
          <div className="relative h-48 mb-4 flex items-center justify-center bg-gray-50 rounded-xl">
            <Image
              src={
                product.images?.[0]?.image
                  ? `${process.env.NEXT_PUBLIC_API_URL}${product.images[0].image}`
                  : product.image
                    ? `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
                    : '/placeholder-product.jpg'
              }
              alt={product.name}
              width={150}
              height={150}
              className="object-contain max-h-40"
            />
            
            {/* Desktop hover add to cart */}
            {!isMobile && (
              <div 
                className={`absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <button
                  onClick={handleAddToCart}
                  className="bg-white text-pink-600 rounded-full p-2 shadow-lg transform transition-transform duration-300 hover:scale-110"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
              {product.name}
            </h3>
            
            <div className="flex flex-col">
              {product.market_price && product.market_price > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.market_price.toLocaleString()}
                </span>
              )}
              <span className="text-lg font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Mobile: Always visible add to cart button */}
          {isMobile && (
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white font-medium rounded-xl py-2 px-4 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          )}
        </div>
      </Link>

      {/* Confirmation after adding to cart */}
      {isAddedToCart && (
        <div className="absolute bottom-0 left-0 right-0 bg-green-50 px-3 py-3 text-center flex flex-col gap-2 rounded-b-2xl border-2 border-t-0 border-green-200 z-20">
          <div className="text-green-800 text-xs">
            Added to cart ✓
          </div>
          <Link 
            href="/cart" 
            onClick={(e) => e.stopPropagation()} 
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg py-2 transition-colors duration-200"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
};

export default function EnhancedProductDetail({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, totalItems } = useCart();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    // Fetch product details
    fetchProductById(id)
      .then(data => {
        setProduct(data);
        setSelectedImage(data.images?.[0]?.image);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
      });

    // Fetch categories
    fetchCategories()
      .then(setCategories)
      .catch(error => {
        console.error('Error fetching categories:', error);
      });

    // Fetch all products for related products
    fetchProducts()
      .then(products => {
        // Filter out current product and get random 3 products
        const otherProducts = products.filter(p => p.id !== parseInt(id));
        const shuffled = otherProducts.sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffled.slice(0, 3));
      })
      .catch(error => {
        console.error('Error fetching related products:', error);
      });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  const categoryName = categories.find(cat => String(cat.id) === String(product.category))?.name || product.category;

  const discountPercentage = product.market_price && product.market_price > product.price
    ? Math.round(((product.market_price - product.price) / product.market_price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      image: product.images?.[0]?.image,
      mrp: product.market_price,
      price: product.price,
      perUnit: product.perUnit
    }, quantity);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
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
            <li className="text-gray-900 font-medium truncate">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-3xl shadow-lg p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative rounded-3xl overflow-hidden border-2 border-pink-100 bg-white">
                {/* Badges */}
                {product.is_featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">FEATURED</span>
                  </div>
                )}
                {product.is_popular && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs font-medium">POPULAR</span>
                  </div>
                )}
                {discountPercentage > 0 && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">{discountPercentage}% OFF</span>
                  </div>
                )}
                
                <div className="h-96 relative">
                  {selectedImage ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}${selectedImage}`}
                      alt={product.name}
                      fill
                      className="object-contain p-6"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <span>No image available</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((imageObj, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(imageObj.image)}
                      className={`relative h-24 rounded-xl overflow-hidden border-2 ${
                        selectedImage === imageObj.image
                          ? "border-pink-500"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${imageObj.image}`}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-contain p-2"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-sm text-gray-500 mt-1">{categoryName}</p>
              </div>

              <div className="flex items-baseline gap-3">
                {product.market_price && product.market_price > product.price && (
                  <>
                    <span className="text-xs text-gray-400 font-semibold">M.R.P.:</span>
                    <span className="text-lg text-gray-400 line-through">₹{product.market_price.toLocaleString()}</span>
                  </>
                )}
                <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                {discountPercentage > 0 && (
                  <span className="ml-2 text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Save {discountPercentage}%
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="text-gray-600 space-y-3">
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: product.description
                        .replace(/<ul>/g, '<ul class="space-y-2 ml-4">')
                        .replace(/<li>/g, '<li class="flex items-start gap-2"><span class="text-pink-500 mt-1">•</span><span>') 
                    }}
                  />
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-900 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-pink-700 hover:to-pink-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Heart 
                    className={`w-6 h-6 ${isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} 
                  />
                </button>
                <button className="p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <Share2 className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Cart Confirmation */}
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

              {/* Service Info */}
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
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You may also like</h2>
              <p className="text-gray-600">Discover more products you might enjoy</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <RelatedProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold py-3 px-8 rounded-xl hover:from-pink-700 hover:to-pink-600 transition-colors duration-200"
              >
                View All Products
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}