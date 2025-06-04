"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ProductForm } from '../../../../components/features/products';
import { addProduct } from '../../../../services';
import { useCategories } from '../../../../contexts/CategoriesContext';

export default function AddProduct() {
  const router = useRouter();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [isLoading, setIsLoading] = useState(false);

  // Handle categories loading error
  if (categoriesError) {
    toast.error('Failed to load categories. Please refresh the page.');
  }

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

  // Show loading state while categories are being fetched
  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

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