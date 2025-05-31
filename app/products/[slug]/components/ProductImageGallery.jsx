"use client";
import { useState } from "react";
import Image from "next/image";

export const ProductImageGallery = ({ product, selectedImage, setSelectedImage }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const discountPercentage = product.discount;

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden bg-white border-2 border-pink-100 rounded-3xl">
        {/* Badges */}
        <div className="absolute z-10 flex gap-2 top-4 left-4">
          {product.is_featured && (
            <span className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full">FEATURED</span>
          )}
          {product.is_popular && (
            <span className="px-2 py-1 text-xs font-medium text-pink-600 bg-pink-100 rounded-full">POPULAR</span>
          )}
        </div>
        
        {discountPercentage > 0 && (
          <div className="absolute z-10 top-4 right-4">
            <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full">{discountPercentage}% OFF</span>
          </div>
        )}
        
        <div 
          className="relative overflow-hidden h-96 cursor-zoom-in"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          {selectedImage ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}${selectedImage}`}
              alt={product.name}
              fill
              className={`object-contain p-6 transition-transform duration-300 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={{
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span>No image available</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Image Thumbnails */}
      {product.images && product.images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {product.images.map((imageObj, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(imageObj.image)}
              className={`relative h-24 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                selectedImage === imageObj.image
                  ? "border-pink-500"
                  : "border-gray-200 hover:border-pink-300"
              }`}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${imageObj.image}`}
                alt={`${product.name} - Image ${index + 1}`}
                fill
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};