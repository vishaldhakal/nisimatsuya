"use client";
import Image from "next/image";
// Add this configuration at the top
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductImageUploader({
  formData,
  dragActive,
  handleDrag,
  handleDrop,
  handleImageUpload,
  handleRemoveImage,
  fileInputRef
}) {
  // Helper function to get the correct image URL
  const getImageUrl = (img) => {
    if (typeof img === 'string') {
      // If it's a relative path, prepend the API base URL
      if (img.startsWith('/media/') || img.startsWith('media/')) {
        return `${API_BASE_URL}${img.startsWith('/') ? img : '/' + img}`;
      }
      // If it's already a full URL, use it directly
      return img;
    }
    if (img && typeof img === 'object') {
      const imagePath = img.image || img.url || img.src || '';
      // If it's a relative path, prepend the API base URL
      if (imagePath.startsWith('/media/') || imagePath.startsWith('media/')) {
        return `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
      }
      return imagePath;
    }
    return '';
  };

  // Helper function to get image name
  const getImageName = (img, index) => {
    if (typeof img === 'string') {
      // Extract filename from URL
      const urlParts = img.split('/');
      return urlParts[urlParts.length - 1] || `Image ${index + 1}`;
    }
    if (img && typeof img === 'object') {
      return img.name || img.filename || `Image ${index + 1}`;
    }
    return `Image ${index + 1}`;
  };

  return (
    <div>
      <label className="block mb-3 text-sm font-medium text-gray-700">Product Images</label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{ cursor: "pointer" }}
      >
        <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <p className="mb-1 font-medium text-gray-700">Drag &amp; drop images here</p>
        <p className="mb-3 text-sm text-gray-500">or click to browse (max 5MB each)</p>
        <p className="mb-3 text-xs text-gray-500">Supported formats: JPEG, PNG, GIF, WebP</p>
        <button
          type="button"
          className="px-4 py-2 font-medium text-white transition duration-150 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
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
          <div className="absolute inset-0 bg-blue-100 rounded-lg opacity-50 pointer-events-none" />
        )}
      </div>

      {/* Image Preview Grid */}
      {formData.images.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 font-medium text-gray-700">
            Image Preview ({formData.images.length})
          </h4>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {formData.images.map((img, idx) => {
              const imageUrl = getImageUrl(img);
              const imageName = getImageName(img, idx);
              
              return (
                <div
                  key={idx}
                  className="relative overflow-hidden transition duration-150 rounded-lg shadow group hover:shadow-md"
                  style={{ width: "70px", height: "70px" }}
                >
                  <div className="w-full h-full bg-gray-100">
                    {imageUrl ? (
                          <div className="relative w-full h-full">
                      <Image
                        src={imageUrl}
                        alt={imageName}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          console.error('Image load error:', imageUrl)
                          console.error('Original image data:', img)
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                        unoptimized 
                      />
                      <div
                        className="absolute inset-0 items-center justify-center hidden text-sm text-gray-500 bg-gray-100"
                      >
                        Failed to load image
                      </div>
                    </div>
                    ) : null}
                    <div 
                      className="flex items-center justify-center w-full h-full text-xs text-gray-500 bg-gray-200"
                      style={{ display: imageUrl ? 'none' : 'flex' }}
                    >
                      No Image
                    </div>
                  </div>
                  <div className="absolute inset-0 transition-opacity duration-200 bg-black bg-opacity-0 group-hover:bg-opacity-30">
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
                  {img.size && (
                    <div className="absolute bottom-0 left-0 right-0 p-1 text-xs text-center text-white bg-black bg-opacity-50">
                      {(img.size / 1024 / 1024).toFixed(1)}MB
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}