"use client";

import { useState, useRef } from 'react';

export default function ProductForm({
  initialData = {
    id: Date.now(),
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
  },
  isEditMode = false,
  onSubmit,
  onCancel,
  categories = []
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve({
              name: file.name,
              image: event.target.result
            });
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    ).then((imageObjects) => {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageObjects],
      }));
    });
  };

  const handleRemoveImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectedCategory = Array.isArray(categories)
  ? categories.find(cat => String(cat.id) === String(formData.category))
  : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Product' : 'Add Product'}
      </h2>
      <form onSubmit={handleFormSubmit} className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>


          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product description..."
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select
              value={formData.category}
              onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}
              required
              className="mb-4 block w-full border rounded p-2"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Market Price</label>
              <input
                type="number"
                step="0.01"
                name="market_price"
                value={formData.market_price}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input
                type="number"
                step="0.01"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Toggle Switches */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Product Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">Popular</span>
                <button
                  type="button"
                  onClick={() => handleToggle('is_popular')}
                  className={`relative h-7 w-14 flex items-center rounded-full px-1 transition-colors duration-300 focus:outline-none ${
                    formData.is_popular ? "bg-green-500" : "bg-gray-300"
                  }`}
                  aria-pressed={formData.is_popular}
                >
                  <span className="sr-only">{formData.is_popular ? 'Enabled' : 'Disabled'}</span>
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                      formData.is_popular ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">Featured</span>
                <button
                  type="button"
                  onClick={() => handleToggle('is_featured')}
                  className={`relative h-7 w-14 flex items-center rounded-full px-1 transition-colors duration-300 focus:outline-none ${
                    formData.is_featured ? "bg-green-500" : "bg-gray-300"
                  }`}
                  aria-pressed={formData.is_featured}
                >
                  <span className="sr-only">{formData.is_featured ? 'Enabled' : 'Disabled'}</span>
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                      formData.is_featured ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">Active</span>
                <button
                  type="button"
                  onClick={() => handleToggle('is_active')}
                  className={`relative h-7 w-14 flex items-center rounded-full px-1 transition-colors duration-300 focus:outline-none ${
                    formData.is_active ? "bg-green-500" : "bg-gray-300"
                  }`}
                  aria-pressed={formData.is_active}
                >
                  <span className="sr-only">{formData.is_active ? 'Enabled' : 'Disabled'}</span>
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                      formData.is_active ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Product Images</label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              style={{ cursor: "pointer" }}
            >
              <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-gray-700 font-medium mb-1">Drag &amp; drop images here</p>
              <p className="text-gray-500 text-sm mb-3">or click to browse (max 5MB each)</p>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow transition duration-150 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current.click();
                }}
              >
                Select Images
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
              {dragActive && (
                <div className="absolute inset-0 bg-blue-100 opacity-50 rounded-lg pointer-events-none" />
              )}
            </div>

            {/* Image Preview Grid */}
            {formData.images.length > 0 && (
              <div className="mt-6">
                <h4 className="text-gray-700 font-medium mb-3">
                  Image Preview ({formData.images.length})
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-lg overflow-hidden shadow hover:shadow-md transition duration-150"
                      style={{ width: "70px", height: "70px" }}
                    >
                      <div className="w-full h-full bg-gray-100">
                        <img
                          src={img.image || img}
                          alt={img.name || `Product ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200">
                        <div className="absolute top-1 right-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            className="bg-red-500 text-white rounded-full p-0.5 opacity-100 transition-opacity duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                            title="Remove image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white text-gray-700 py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEditMode ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}