"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import ProductForm from '../ProductForm';

function EditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [initialData, setInitialData] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from API
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(error => {
        console.error('Error fetching categories:', error);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    if (!id) return;

    // First try to fetch from API
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}/`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(product => {
        setInitialData({
          ...product,
          images: product.images || []
        });
      })
      .catch(error => {
        console.error('Error fetching product from API:', error);
        
        // Fallback to localStorage if API fails
        const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
        const product = storedProducts.find((p) => String(p.id) === String(id));
        
        if (product) {
          setInitialData({
            id: product.id,
            name: product.name || '',
            slug: product.slug || '',
            description: product.description || '',
            market_price: product.mrp || product.market_price || '',
            price: product.price || '',
            stock: product.stock || 0,
            category: product.category || '',
            is_popular: product.isPopular || product.is_popular || false,
            is_featured: product.isFeatured || product.is_featured || false,
            discount: product.discount || '',
            is_active: product.is_active !== undefined ? product.is_active : true,
            images: product.images || (product.image ? [{name: 'Product Image', image: product.image}] : [])
          });
        }
      });
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        market_price: parseFloat(formData.market_price),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: parseInt(formData.category),
        is_popular: formData.is_popular,
        is_featured: formData.is_featured,
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        is_active: formData.is_active,
        images: formData.images.map(img => ({
          name: img.name || 'Product Image',
          image: img.image || img
        }))
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      alert("Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error('Error updating product:', error);
      
      // Fallback to localStorage if API fails
      const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
      const updatedProducts = storedProducts.map((p) =>
        String(p.id) === String(id)
          ? { 
              ...formData, 
              id: p.id, 
              image: formData.images[0]?.image || formData.images[0] || "",
              mrp: formData.market_price,
              isPopular: formData.is_popular,
              isFeatured: formData.is_featured
            }
          : p
      );
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      alert("Product updated successfully (saved locally)!");
      router.push("/admin/products");
    }
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  if (!id) return <div className="p-6 text-center">Invalid product ID.</div>;
  if (!initialData) return <div className="p-6 text-center">Loading...</div>;

  return (
    <ProductForm 
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode={true}
      categories={categories}
    />
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded mb-6"></div>
        <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
      </div>
    </div>
  );
}

export default function EditProduct() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EditProductPage />
    </Suspense>
  );
}