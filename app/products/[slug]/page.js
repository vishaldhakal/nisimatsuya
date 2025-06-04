"use client";
import { useEffect, useState } from "react";
import { useCart } from "../../../components/features/cart/CartContext";
import { fetchProductByCategoryAndSlug } from "../../../services/api/productService";
import { useCategories } from "../../../contexts/CategoriesContext";
import { useProducts } from "../../../contexts/ProductsContext";
import {
  Breadcrumb,
  ProductImageGallery,
  ProductInfo,
  RelatedProductsSection,
  LoadingSpinner
} from './components';

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, totalItems } = useCart();
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Use contexts
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { getProductBySlug, products, loading: productsLoading } = useProducts();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First try to get product from context
        let foundProduct = getProductBySlug(slug);
        
        // If not found in context and products are still loading, wait
        if (!foundProduct && productsLoading) {
          setLoading(true);
          return;
        }
        
        // If still not found after products loaded, show error
        if (!foundProduct && !productsLoading) {
          throw new Error('Product not found');
        }

        // Now fetch the detailed product data using the correct API endpoint
        let productData;
        if (foundProduct.category_slug) {
          productData = await fetchProductByCategoryAndSlug(foundProduct.category_slug, slug);
        } else {
          // Fallback method
          const { fetchProductBySlug } = await import("../../../services/api/productService");
          productData = await fetchProductBySlug(slug);
        }

        if (!productData || typeof productData !== 'object') {
          throw new Error('Invalid product data received');
        }

        setProduct(productData);
        setSelectedImage(productData.images?.[0]?.image || null);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug && !productsLoading) {
      loadData();
    }
  }, [slug, getProductBySlug, productsLoading]);

  const handleAddToCart = () => {
    if (!product) return;
    
    try {
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

  if (loading || categoriesLoading || productsLoading) return <LoadingSpinner />;
  
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

  if (categoriesError) {
    console.warn('Categories loading error:', categoriesError);
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