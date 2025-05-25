"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import {ProductForm} from '../../../../components/features/products';
import { editProduct, fetchProduct, fetchCategories } from '../../../../services';

function EditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [initialData, setInitialData] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!id) return;
    fetchProduct(id)
      .then((data) => {
        // Normalize images for ProductForm
        const images = Array.isArray(data.images)
          ? data.images.map(img =>
              typeof img === 'string'
                ? { name: '', image: img }
                : img
            )
          : [];
        setInitialData({ ...data, images });
      })
      .catch(() => setInitialData(null));
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await editProduct(id, formData);
      alert("Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      alert(error.message || "Something went wrong!");
    }
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  if (!id) return <div className="p-6 text-center">Invalid product id.</div>;
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