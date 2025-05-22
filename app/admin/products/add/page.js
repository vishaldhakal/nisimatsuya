"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductForm from '../ProductForm';

export default function AddProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from API
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      },
      withCredentials: true,
    })
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(error => {
        console.error('Error fetching categories:', error);
        setCategories([]);
      });
  }, []);

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product");
      }

      alert("Product added successfully!");
      router.push('/admin/products');
    } catch (error) {
      console.error('Error adding product:', error);
      alert(error.message || "Something went wrong!");
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  return (
    <ProductForm 
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode={false}
      categories={categories}
    />
  );
}