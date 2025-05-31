// Clean Product Detail Page
"use client";
import { useEffect, useState } from "react";
import { useCart } from "../../../components/features/cart/CartContext";
import { fetchProducts, fetchProductBySlug } from "../../../services/api/productService";
import { fetchCategories } from "../../../services/api/categoryService";
import {
  Breadcrumb,
  ProductImageGallery,
  ProductInfo,
  RelatedProductsSection,
  LoadingSpinner
} from './components';

// Safe component wrapper to catch rendering errors
const SafeComponent = ({ children, fallback = null, componentName = "Component" }) => {
  try {
    return children;
  } catch (error) {
    console.error(`Error in ${componentName}:`, error);
    return fallback || <div>Error loading {componentName}</div>;
  }
};

export default function ProductDetail({ params }) {
  const { slug } = params;
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, totalItems } = useCart();
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First get all products to find the one with matching slug
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);

        // Ensure we have valid data
        if (!Array.isArray(productsData)) {
          throw new Error('Invalid products data received');
        }
        if (!Array.isArray(categoriesData)) {
          throw new Error('Invalid categories data received');
        }

        // Find the product by slug
        const foundProduct = productsData.find(p => p && p.slug === slug);
        if (!foundProduct) {
          throw new Error('Product not found');
        }

        // Now fetch the detailed product data using the correct API endpoint
        let productData;
        if (foundProduct.category_slug) {
          // If category_slug exists, use fetchProductByCategoryAndSlug
          const { fetchProductByCategoryAndSlug } = await import("../../../services/api/productService");
          productData = await fetchProductByCategoryAndSlug(foundProduct.category_slug, slug);
        } else {
          // Use the deprecated method as fallback
          productData = await fetchProductBySlug(slug);
        }

        // Validate product data before setting state
        if (!productData || typeof productData !== 'object') {
          throw new Error('Invalid product data received');
        }

        setProduct(productData);
        setSelectedImage(productData.images?.[0]?.image || null);
        setCategories(categoriesData);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadData();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) {
      return;
    }
    
    try {
      // Ensure all required fields are properly formatted
      const cartItem = {
        id: product.id,
        name: String(product.name || 'Unknown Product'),
        image: product.images?.[0]?.image || null,
        thumbnail_image: product.thumbnail_image || null,
        mrp: Number(product.market_price) || 0,
        price: Number(product.price) || 0,
        perUnit: product.perUnit || 'piece'
      };
      
      addToCart(cartItem, quantity);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 5000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="p-6 text-center bg-white shadow-lg rounded-3xl">
            <h2 className="mb-4 text-2xl font-bold text-red-600">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="p-6 text-center bg-white shadow-lg rounded-3xl">
            <h2 className="mb-4 text-2xl font-bold text-gray-600">Product not found</h2>
            <p className="text-gray-600">The requested product could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        <SafeComponent componentName="Breadcrumb">
          <Breadcrumb product={product} />
        </SafeComponent>
        
        <div className="p-6 bg-white shadow-lg rounded-3xl lg:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            
            <SafeComponent componentName="ProductImageGallery">
              <ProductImageGallery 
                product={product} 
                selectedImage={selectedImage} 
                setSelectedImage={setSelectedImage} 
              />
            </SafeComponent>
            
            <SafeComponent componentName="ProductInfo">
              <ProductInfo 
                product={product} 
                categories={categories} 
                quantity={quantity} 
                setQuantity={setQuantity} 
                handleAddToCart={handleAddToCart} 
                isAddedToCart={isAddedToCart} 
                totalItems={totalItems} 
              />
            </SafeComponent>
            
          </div>
        </div>

        <SafeComponent componentName="RelatedProductsSection">
          <RelatedProductsSection product={product} />
        </SafeComponent>
        
      </div>
    </div>
  );
}