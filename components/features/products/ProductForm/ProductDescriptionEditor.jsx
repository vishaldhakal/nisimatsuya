"use client";

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function ProductDescriptionEditor({ formData, handleDescriptionChange }) {
  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description <span className="text-red-500">*</span>
      </label>
      <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <ReactQuill
          theme="snow"
          value={formData.description}
          onChange={handleDescriptionChange}
          modules={quillModules}
          formats={quillFormats}
          placeholder="Enter product description..."
          style={{ 
            backgroundColor: 'white',
            minHeight: '150px'
          }}
        />
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Use the toolbar to format your product description with bold, italic, lists, links and more.
      </p>
    </div>
  );
}