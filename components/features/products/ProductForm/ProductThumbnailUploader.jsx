"use client";
import { useRef } from 'react';
import Image from 'next/image';

export default function ProductThumbnailUploader({
  thumbnail,
  onThumbnailChange,
  onThumbnailRemove
}) {
  const fileInputRef = useRef(null);

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
      const thumbnailData = {
        name: file.name,
        image: event.target.result,
        file: file,
        size: file.size,
        type: file.type,
        isExisting: false
      };
      onThumbnailChange(thumbnailData);
    };
    reader.readAsDataURL(file);

    // Clear the input
    e.target.value = '';
  };

  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Thumbnail Image
      </label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleThumbnailUpload}
      />

      {thumbnail ? (
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
  src={
    thumbnail.image.startsWith('data:')
      ? thumbnail.image
      : `${process.env.NEXT_PUBLIC_API_URL}${thumbnail.image}`
  }
  alt="Thumbnail preview"
  width={80}
  height={80}
  className="object-cover border border-gray-300 rounded-md"
  unoptimized
/>

          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Change
            </button>
            <button
              type="button"
              onClick={onThumbnailRemove}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className="p-4 text-center transition-colors border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500"
          onClick={() => fileInputRef.current?.click()}
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
        </div>
      )}
    </div>
  );
}