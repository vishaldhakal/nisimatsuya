
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import blogService from '../../../../../services/api/blogService';
import { BlogForm } from '../../../../../components/features/admin/blogs';

const EditBlogPage = () => {
  const router = useRouter();
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchBlog();
    }
  }, [params.id]);

  const fetchBlog = async () => {
    try {
      setIsLoading(true);
      const response = await blogService.getBlogBySlug(params.id);
      setBlog(response);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch blog');
      console.error('Error fetching blog:', error);
      router.push('/admin/blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBlog = async (blogData) => {
    try {
      setIsSubmitting(true);
      await blogService.updateBlog(params.id, blogData);
      toast.success('Blog updated successfully!');
      router.push('/admin/blogs');
    } catch (error) {
      toast.error(error.message || 'Failed to update blog');
      console.error('Error updating blog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/blogs');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading blog...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen py-8 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Blog Not Found</h2>
              <p className="mt-2 text-gray-600">The blog post you're looking for doesn't exist.</p>
              <button
                onClick={handleCancel}
                className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Back to Blogs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
              <p className="mt-2 text-gray-600">
                Update the details for "{blog.title}"
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
          blog={blog}
          onSubmit={handleUpdateBlog}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditBlogPage;