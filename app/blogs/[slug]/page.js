'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaTags } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import blogService from '../../../services/api/blogService';

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-yellow-50 to-pink-50">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto border-b-2 border-pink-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-pink-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-yellow-50 to-pink-50">
        <div className="text-center">
          <p className="mb-4 text-lg text-red-600">Error: {error}</p>
          <Link href="/blogs" className="px-4 py-2 text-white bg-pink-600 rounded-lg hover:bg-pink-700">
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
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-pink-50">
      <div className="container max-w-4xl px-4 py-12 mx-auto">
        <Link href="/blogs" className="flex items-center mb-6 text-pink-600 transition-colors hover:text-pink-800">
          <FaArrowLeft className="mr-2" /> Back to all blogs
        </Link>
        
        <article className="overflow-hidden bg-white border border-pink-100 rounded-lg shadow-md">
          {/* Featured Image */}
          {blog.thumbnail_image ? (
            <div className="relative w-full h-64 md:h-80">
              <Image 
                src={blog.thumbnail_image} 
                alt={blog.thumbnail_image_alt_description || blog.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-64 md:h-80 bg-gradient-to-r from-pink-100 to-yellow-100">
              <div className="text-center text-pink-300">
                <div className="mb-4 text-6xl">📝</div>
                <p className="text-lg">Blog Post</p>
              </div>
            </div>
          )}
          
          <div className="p-6 md:p-8">
            {/* Category Badge */}
            {blog.category && (
              <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-pink-800 bg-pink-100 rounded-full">
                {blog.category.title}
              </span>
            )}
            
            {/* Title */}
            <h1 className="mb-4 text-2xl font-bold leading-tight text-pink-800 md:text-3xl lg:text-4xl">
              {blog.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-1 text-pink-500" />
                <span>Published {formatDate(blog.created_at)}</span>
              </div>
              
              {blog.author && (
                <div className="flex items-center">
                  <FaUser className="mr-1 text-pink-500" />
                  <span>
                    {typeof blog.author === 'object' 
                      ? `${blog.author.first_name || ''} ${blog.author.last_name || ''}`.trim() || blog.author.username
                      : blog.author
                    }
                  </span>
                </div>
              )}
              
              {blog.updated_at !== blog.created_at && (
                <div className="flex items-center text-xs">
                  <span>Updated {formatDate(blog.updated_at)}</span>
                </div>
              )}
            </div>
            
            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <FaTags className="text-sm text-pink-400" />
                {blog.tags.map((tag) => (
                  <span 
                    key={tag.id} 
                    className="px-3 py-1 text-sm font-medium text-pink-600 rounded-full bg-pink-50"
                  >
                    {tag.title}
                  </span>
                ))}
              </div>
            )}
            
            {/* Meta Description */}
            {blog.meta_description && (
              <div className="p-4 mb-6 border-l-4 border-pink-300 rounded bg-pink-50">
                <p className="italic font-medium text-pink-800">
                  {blog.meta_description}
                </p>
              </div>
            )}
            
            {/* Content Placeholder */}
            <div className="prose max-w-none">
              <div className="p-6 text-center border border-yellow-200 rounded-lg bg-yellow-50">
                <div className="mb-3 text-4xl">📖</div>
                <h3 className="mb-2 text-lg font-semibold text-yellow-800">Content Coming Soon</h3>
                <p className="text-yellow-700">
                  The full blog content will be displayed here once it's available from the API. 
                  Currently showing the blog metadata and structure.
                </p>
              </div>
            </div>
          </div>
        </article>
        
        {/* Author Info Section */}
        {blog.author && (
          <div className="p-6 mt-12 border border-pink-100 rounded-lg bg-pink-50">
            <h2 className="mb-4 text-xl font-bold text-pink-800">About the Author</h2>
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-pink-200 rounded-full">
                <FaUser className="text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-pink-800">
                  {typeof blog.author === 'object' 
                    ? `${blog.author.first_name || ''} ${blog.author.last_name || ''}`.trim() || blog.author.username
                    : blog.author
                  }
                </h3>
                <p className="mt-1 text-gray-700">
                  Expert contributor sharing insights about {blog.category?.title.toLowerCase() || 'baby care'} 
                  and parenting tips to help families make informed decisions.
                </p>
              </div>
            </div>
          </div>
        )}
      
      </div>
    </div>
  );
}