"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductForm from '../ProductForm';
import { addProduct, fetchCategories } from '../../../../services/productService';

export default function AddProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const handleSubmit = async (formData) => {
    try {
      await addProduct(formData);
      alert("Product added successfully!");
      router.push('/admin/products');
    } catch (error) {
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