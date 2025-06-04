"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { toast } from 'react-hot-toast';
import { ProductForm } from '../../../../components/features/products';
import { editProduct, fetchProductBySlug } from '../../../../services';
import { useCategories } from '../../../../contexts/CategoriesContext';

function EditProductPage() {
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [initialData, setInitialData] = useState(null);
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Handle categories loading error
  if (categoriesError) {
    toast.error('Failed to load categories. Please refresh the page.');
  }

  // Helper function to normalize image data
  const normalizeImageData = (images) => {
    if (!Array.isArray(images)) return [];
    
    return images.map((img, index) => {
      if (typeof img === 'string') {
        return {
          name: img.split('/').pop() || `image_${index}`,
          image: img,
          type: 'image/jpeg',
          size: null,
          isExisting: true
        };
      } else if (img && typeof img === 'object') {
        return {
          name: img.name || img.filename || `image_${index}`,
          image: img.image || img.url || img.src || img,
          type: img.type || 'image/jpeg',
          size: img.size || null,
          file: img.file || null,
          isExisting: !img.file
        };
      }
      return null;
    }).filter(Boolean);
  };

  const normalizeThumbnailData = (thumbnail) => {
    if (!thumbnail) return null;
    
    if (typeof thumbnail === 'string') {
      return {
        name: thumbnail.split('/').pop() || 'thumbnail',
        image: thumbnail, 
        type: 'image/jpeg', 
        size: null, 
        isExisting: true 
      };
    } else if (thumbnail && typeof thumbnail === 'object') {
      return {
        name: thumbnail.name || thumbnail.filename || 'thumbnail',
        image: thumbnail.image || thumbnail.url || thumbnail.src || thumbnail,
        type: thumbnail.type || 'image/jpeg',
        size: thumbnail.size || null,
        file: thumbnail.file || null,
        isExisting: !thumbnail.file 
      };
    }
    
    return null;
  };

  // Helper function to normalize category data
  const normalizeCategoryData = (categoryData) => {
    // If it's already a number (ID), return it
    if (typeof categoryData === 'number') {
      return categoryData;
    }
    
    // If it's a string that can be parsed as a number
    if (typeof categoryData === 'string' && !isNaN(parseInt(categoryData))) {
      return parseInt(categoryData);
    }
    
    // If it's an object with an id property
    if (typeof categoryData === 'object' && categoryData !== null) {
      if (categoryData.id) {
        return parseInt(categoryData.id);
      }
      // Some APIs might return { category: id } structure
      if (categoryData.category) {
        return parseInt(categoryData.category);
      }
    }
    
    // Fallback: return null or empty string for select default
    return '';
  };

  useEffect(() => {
    if (!slug || categoriesLoading) {
      setDataLoading(categoriesLoading);
      return;
    }

    const loadProduct = async () => {
      try {
        const data = await fetchProductBySlug(slug);
        
        console.log('Raw product data:', data); // Debug log
        
        // Normalize all data including category
        const normalizedImages = normalizeImageData(data.images);
        const normalizedThumbnail = normalizeThumbnailData(data.thumbnail_image);
        const normalizedCategory = normalizeCategoryData(data.category);
        
        console.log('Normalized category:', normalizedCategory); // Debug log
        console.log('Available categories:', categories); // Debug log
          
        setInitialData({ 
          ...data, 
          images: normalizedImages,
          thumbnail_image: normalizedThumbnail,
          category: normalizedCategory, // Use normalized category
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || ''
        });
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Failed to load product data. Please try again.');
        setInitialData(null);
      } finally {
        setDataLoading(false);
      }
    };

    loadProduct();
  }, [slug, categories, categoriesLoading]); // Add categoriesLoading as dependency

  const handleSubmit = async (formData) => {
    if (isLoading) return;

    setIsLoading(true);
    
    try {
      console.log('Submitting form data:', formData);
      
      // Prepare the category data properly
      let categoryData = formData.category;
      
      // If the form submitted just a category ID, we need to get the full category object
      if (typeof categoryData === 'number' || typeof categoryData === 'string') {
        const categoryId = parseInt(categoryData);
        const category = categories.find(cat => cat.id === categoryId);
        if (category) {
          categoryData = category;
        } else {
          // Fallback to original product data if category not found in current list
          const originalProductData = await fetchProductBySlug(slug);
          categoryData = originalProductData.category;
        }
      }
      
      // If we still don't have a category with slug, fetch the original data
      if (!categoryData || !categoryData.slug) {
        const originalProductData = await fetchProductBySlug(slug);
        categoryData = originalProductData.category;
      }
      
      // Prepare the data with category object and slug
      const submitData = {
        ...formData,
        slug: slug,
        category: categoryData
      };
      
      console.log('Submit data with category:', submitData);
      
      await editProduct(submitData);
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error('Edit product error:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
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
          toast.error('Failed to update product. Please check your input and try again.');
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
    router.push("/admin/products");
  };

  if (!slug) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Invalid Product ID</h2>
          <p className="mb-4 text-gray-600">No product ID was provided.</p>
          <button
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (categoriesLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Product Not Found</h2>
          <p className="mb-4 text-gray-600">The requested product could not be loaded.</p>
          <button
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductForm 
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode={true}
      categories={categories}
      isLoading={isLoading}
    />
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-3xl p-6 mx-auto">
      <div className="animate-pulse">
        <div className="w-1/4 h-8 mb-6 bg-gray-200 rounded"></div>
        <div className="h-64 mb-6 bg-gray-200 rounded"></div>
        <div className="w-1/3 h-12 mx-auto bg-gray-200 rounded"></div>
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