

"use client";
import { useEffect, useState } from "react";
import { useCart } from "../../../components/features/cart/CartContext";
import { fetchProductBySlug, fetchProducts, fetchCategories } from "../../../services";
import {
  Breadcrumb,
  ProductImageGallery,
  ProductInfo,
  RelatedProductsSection,
  LoadingSpinner
} from './components';
export default function ProductDetail({ params }) {
  const { slug } = params;
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, totalItems } = useCart();
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, categoriesData, productsData] = await Promise.all([
          fetchProductBySlug(slug),
          fetchCategories(),
          fetchProducts()
        ]);

        setProduct(productData);
        setSelectedImage(productData.images?.[0]?.image);
        setCategories(categoriesData);

        // Filter and set related products
        const otherProducts = productsData.filter(p => p.id !== productData.id);
        const shuffled = otherProducts.sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffled.slice(0, 3));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [slug]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      image: product.images?.[0]?.image,
      thumbnail_image: product.thumbnail_image,
      mrp: product.market_price,
      price: product.price,
      perUnit: product.perUnit
    }, quantity);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 5000);
  };

  if (!product) return <LoadingSpinner />;

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Breadcrumb product={product} />
        
        <div className="p-6 bg-white shadow-lg rounded-3xl lg:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <ProductImageGallery 
              product={product} 
              selectedImage={selectedImage} 
              setSelectedImage={setSelectedImage} 
            />
            <ProductInfo 
              product={product} 
              categories={categories} 
              quantity={quantity} 
              setQuantity={setQuantity} 
              handleAddToCart={handleAddToCart} 
              isAddedToCart={isAddedToCart} 
              totalItems={totalItems} 
            />
          </div>
        </div>

        <RelatedProductsSection relatedProducts={relatedProducts} />
      </div>
    </div>
  );
}