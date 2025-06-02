'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaTags, FaClock, FaFolder } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import blogService from '../../../services/api/blogService';
import './style/quill-content.css'

export default function BlogPost({ params }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const blogData = await blogService.getBlogBySlug(params.slug);
        setBlog(blogData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchBlog();
    }
  }, [params.slug]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 font-medium text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-800">Something went wrong</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <Link 
            href="/blogs" 
            className="inline-flex items-center px-6 py-3 font-medium text-white transition-colors duration-200 bg-pink-600 rounded-lg hover:bg-pink-700"
          >
            <FaArrowLeft className="mr-2" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Link 
            href="/blogs" 
            className="inline-flex items-center font-medium text-pink-600 transition-colors duration-200 hover:text-pink-800"
          >
            <FaArrowLeft className="mr-2" /> 
            Back to all blogs
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <article className="overflow-hidden bg-white">
          {/* Featured Image */}
          {blog.thumbnail_image ? (
            <div className="relative w-full h-64 md:h-80 lg:h-96">
              <Image 
                src={blog.thumbnail_image} 
                alt={blog.thumbnail_image_alt_description || blog.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-64 md:h-80 bg-gradient-to-br from-pink-50 to-purple-50">
              <div className="text-center text-gray-400">
                <div className="mb-4 text-6xl">📝</div>
                <p className="text-lg font-medium">Blog Post</p>
              </div>
            </div>
          )}
          
          <div className="p-6 md:p-8 lg:p-10">
            {/* Category and Tags Section */}
            <div className="mb-6">
              {/* Category Badge - Larger, more prominent */}
              {blog.category && (
                <div className="mb-3">
                  <span className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm bg-gradient-to-r from-pink-600 to-pink-700">
                    <FaFolder className="mr-2 text-sm" />
                    {blog.category.title}
                  </span>
                </div>
              )}
              
              {/* Tags - Smaller, subtle styling */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span 
                      key={tag.id} 
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200"
                    >
                      <FaTags className="mr-1 text-xs opacity-60" />
                      {tag.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Title */}
            <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
              {blog.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 pb-6 mb-8 border-b border-gray-200">
              <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="mr-2 text-pink-500" />
                <span className="font-medium">Published {formatDate(blog.created_at)}</span>
              </div>
              
              {blog.updated_at !== blog.created_at && (
                <div className="flex items-center text-gray-500">
                  <FaClock className="mr-2 text-pink-400" />
                  <span className="text-sm">Updated {formatDate(blog.updated_at)}</span>
                </div>
              )}
            </div>
            
            {/* Rich Text Content */}
            <div className="max-w-none">
              {blog.description ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                  className="prose prose-lg ql-editor prose-pink max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-pink-600 hover:prose-a:text-pink-800 prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-pink-50 prose-pre:bg-gray-900"
                />
              ) : (
                <div className="px-6 py-12 text-center border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-yellow-100 rounded-full">
                    <span className="text-3xl">📖</span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-yellow-800">Content Coming Soon</h3>
                  <p className="max-w-md mx-auto text-yellow-700">
                    The blog content is being prepared and will be available soon. Please check back later for the full article.
                  </p>
                </div>
              )}
            </div>
          </div>
        </article>
        
        {/* Navigation Footer */}
        <div className="pt-8 mt-12 text-center border-t border-gray-100">
          <Link 
            href="/blogs" 
            className="inline-flex items-center px-6 py-3 font-medium text-white transition-all duration-200 bg-pink-600 rounded-lg hover:bg-pink-700"
          >
            <FaArrowLeft className="mr-2" />
            Browse More Articles
          </Link>
        </div>
      </div>
    </div>
  );
}