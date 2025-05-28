"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ProductForm } from '../../../../components/features/products';
import { addProduct, fetchCategories } from '../../../../services';

export default function AddProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories. Please refresh the page.');
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (formData) => {
    if (isLoading) return;

    setIsLoading(true);
    
    try {
      await addProduct(formData);
      toast.success("Product added successfully!");
      router.push('/admin/products');
    } catch (error) {
      console.error('Add product error:', error);
      
      // Handle specific error cases
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle validation errors
        if (errorData.non_field_errors) {
          errorData.non_field_errors.forEach(err => {
            if (err.includes('name, category must make a unique set')) {
              toast.error('A product with this name already exists in the selected category. Please choose a different name or category.');
            } else {
              toast.error(err);
            }
          });
        } else if (errorData.name) {
          toast.error(`Name: ${Array.isArray(errorData.name) ? errorData.name.join(', ') : errorData.name}`);
        } else if (errorData.category) {
          toast.error(`Category: ${Array.isArray(errorData.category) ? errorData.category.join(', ') : errorData.category}`);
        } else if (errorData.price) {
          toast.error(`Price: ${Array.isArray(errorData.price) ? errorData.price.join(', ') : errorData.price}`);
        } else if (errorData.detail) {
          toast.error(errorData.detail);
        } else {
          toast.error('Failed to add product. Please check your input and try again.');
        }
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isLoading) {
      toast.error('Please wait for the current operation to complete.');
      return;
    }
    router.push('/admin/products');
  };

  return (
    <ProductForm 
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode={false}
      categories={categories}
      isLoading={isLoading}
    />
  );
}