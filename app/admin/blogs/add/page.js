
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import blogService from '../../../../services/api/blogService';
import { BlogForm } from '../../../../components/features/admin/blogs';

const AddBlogPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateBlog = async (blogData) => {
    try {
      setIsSubmitting(true);
      await blogService.createBlog(blogData);
      toast.success('Blog created successfully!');
      router.push('/admin/blogs');
    } catch (error) {
      toast.error(error.message || 'Failed to create blog');
      console.error('Error creating blog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/blogs');
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
              <p className="mt-2 text-gray-600">
                Fill in the details below to create a new blog post.
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Back to Blogs
            </button>
          </div>
        </div>

        {/* Blog Form */}
        <BlogForm
          onSubmit={handleCreateBlog}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AddBlogPage;