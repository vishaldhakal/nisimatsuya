"use client";

export default function ProductImageUploader({
  formData,
  dragActive,
  handleDrag,
  handleDrop,
  handleImageUpload,
  handleRemoveImage,
  fileInputRef
}) {
  return (
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
        onClick={() => fileInputRef.current?.click()}
        style={{ cursor: "pointer" }}
      >
        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <p className="text-gray-700 font-medium mb-1">Drag &amp; drop images here</p>
        <p className="text-gray-500 text-sm mb-3">or click to browse (max 5MB each)</p>
        <p className="text-gray-500 text-xs mb-3">Supported formats: JPEG, PNG, GIF, WebP</p>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow transition duration-150 focus:ring-2 focus:ring-blue-300 focus:outline-none"
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
                {img.size && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                    {(img.size / 1024 / 1024).toFixed(1)}MB
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}