"use client";

import { useState, useRef } from 'react';
import ProductFormFields from './ProductFormFields';
import ProductPriceSection from './ProductPriceSection';
import ProductStatusToggles from './ProductStatusToggles';
import ProductImageUploader from './ProductImageUploader';
import ProductDescriptionEditor from './ProductDescriptionEditor';

export default function ProductForm({
  initialData = {
    name: '',
    description: '',
    market_price: '',
    price: '',
    stock: 0,
    category: '',
    is_popular: false,
    is_featured: false,
    discount: '',
    is_active: true,
    images: [],
    meta_title: '',
    meta_description: '',
    thumbnail_image: null,
  },
  isEditMode = false,
  onSubmit,
  onCancel,
  categories = []
}) {
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDescriptionChange = (content) => {
    setFormData(prev => ({
      ...prev,
      description: content
    }));
  };

  const handleToggle = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (files.some(file => file.size > maxSize)) {
      alert(`Some files are too large. Maximum size is 5MB per file.`);
      return;
    }

    if (files.some(file => !allowedTypes.includes(file.type))) {
      alert('Please select only image files (JPEG, PNG, GIF, WebP).');
      return;
    }

    Promise.all(
      files.map(file => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve({
          name: file.name,
          image: event.target.result,
          file: file,
          size: file.size,
          type: file.type
        });
        reader.readAsDataURL(file);
      }))
    ).then((imageObjects) => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageObjects],
      }));
    }).catch((error) => {
      console.error('Error processing images:', error);
      alert('Error processing some images. Please try again.');
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      alert('File is too large. Maximum size is 5MB.');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      alert('Please select only image files (JPEG, PNG, GIF, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        thumbnail_image: {
          name: file.name,
          image: event.target.result,
          file: file,
          size: file.size,
          type: file.type
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveThumbnail = () => {
    setFormData(prev => ({
      ...prev,
      thumbnail_image: null
    }));
  };

  const handleRemoveImage = (idx) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    // Validation
    if (!formData.name?.trim()) {
      alert('Product name is required');
      return;
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formData.description;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    if (!textContent.trim()) {
      alert('Product description is required');
      return;
    }
    
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    
    if (parseFloat(formData.price) <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    
    setIsSubmitting(true);
    
    const submitData = {
      ...formData,
      market_price: parseFloat(formData.market_price) || 0,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      discount: parseFloat(formData.discount) || 0,
      category: parseInt(formData.category) || null,
      name: formData.name.trim(),
      meta_title: formData.meta_title.trim(),
      meta_description: formData.meta_description.trim(),
    };
    
    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl px-4 py-6 mx-auto">
      <h2 className="mb-6 text-2xl font-bold">
        {isEditMode ? 'Edit Product' : 'Add Product'}
      </h2>
      
      <form onSubmit={handleFormSubmit} className="overflow-hidden bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          <ProductFormFields 
            formData={formData} 
            handleChange={handleChange} 
            categories={categories} 
          />
          
          {/* Meta Fields */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Meta Title
              </label>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength="60"
              />
              <p className="mt-1 text-xs text-gray-500">
                Recommended length: 50-60 characters ({formData.meta_title.length}/60)
              </p>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Meta Description
              </label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                maxLength="160"
              />
              <p className="mt-1 text-xs text-gray-500">
                Recommended length: 150-160 characters ({formData.meta_description.length}/160)
              </p>
            </div>
          </div>

          {/* Thumbnail Image */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Thumbnail Image
            </label>
            {formData.thumbnail_image ? (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={formData.thumbnail_image.image || formData.thumbnail_image}
                    alt="Thumbnail preview"
                    className="object-cover w-20 h-20 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailUpload}
                />
              </div>
            ) : (
              <div
                className="p-4 text-center transition-colors border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500"
                onClick={() => thumbnailInputRef.current?.click()}
              >
                <svg
                  className="w-12 h-12 mx-auto text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-1 text-sm text-gray-600">Click to upload thumbnail</p>
                <p className="text-xs text-gray-500">Recommended size: 500x500px</p>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailUpload}
                />
              </div>
            )}
          </div>

          <ProductDescriptionEditor 
            formData={formData} 
            handleDescriptionChange={handleDescriptionChange} 
          />
          
          <ProductPriceSection 
            formData={formData} 
            handleChange={handleChange} 
          />
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Stock Quantity</label>
            <input
              type="number"
              min="0"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
              required
            />
          </div>
          
          <ProductStatusToggles 
            formData={formData} 
            handleToggle={handleToggle} 
          />
          
          <ProductImageUploader
            formData={formData}
            dragActive={dragActive}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
            handleImageUpload={handleImageUpload}
            handleRemoveImage={handleRemoveImage}
            fileInputRef={fileInputRef}
          />
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isSubmitting ? 'Processing...' : (isEditMode ? 'Save Changes' : 'Add Product')}
          </button>
        </div>
      </form>
    </div>
  );
}