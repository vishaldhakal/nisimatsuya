'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaUser, FaTags } from 'react-icons/fa';
import blogService from '../../services/api/blogService';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [blogsData, categoriesData] = await Promise.all([
          blogService.getBlogs(),
          blogService.getCategories()
        ]);
        
        setBlogs(blogsData.results || []);
        setCategories(categoriesData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto border-b-2 border-pink-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-pink-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-red-600">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 mt-4 text-white bg-pink-600 rounded-lg hover:bg-pink-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-12 mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="p-8 mb-12 bg-gradient-to-r from-pink-100 to-yellow-100 rounded-xl">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-pink-800">Nishimatsuya Baby Blog</h1>
            <p className="text-xl text-pink-700">Expert advice and tips for parents and caregivers</p>
            <p className="mt-2 text-sm text-pink-600">
              {blogs.length} {blogs.length === 1 ? 'article' : 'articles'} available
            </p>
          </div>
        </div>

        {/* Blog Posts */}
        {blogs.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-600">No blog posts available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div key={blog.id} className="flex flex-col overflow-hidden transition-shadow duration-300 bg-white border border-pink-100 rounded-lg shadow-md hover:shadow-lg">
                <div className="relative w-full h-56 overflow-hidden bg-pink-50">
                  {blog.thumbnail_image ? (
                    <Image 
                      src={blog.thumbnail_image} 
                      alt={blog.thumbnail_image_alt_description || blog.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-pink-300">
                      <div className="text-center">
                        <div className="mb-2 text-4xl">📝</div>
                        <p className="text-sm">No Image</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-pink-500 rounded-full">
                      {blog.category?.title || 'Uncategorized'}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col flex-1 p-6">
                  <h2 className="mb-2 text-xl font-bold text-pink-800 transition-colors hover:text-pink-600">
                    <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                  </h2>
                  
                  <p className="flex-1 mb-4 text-gray-600">
                    {blog.meta_description || 'Click to read more about this article...'}
                  </p>
                  
                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      <FaTags className="mt-1 mr-1 text-sm text-pink-400" />
                      {blog.tags.map((tag) => (
                        <span 
                          key={tag.id} 
                          className="px-2 py-1 text-xs text-pink-600 rounded bg-pink-50"
                        >
                          {tag.title}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-auto text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1 text-pink-500" />
                      <span>{formatDate(blog.created_at)}</span>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Newsletter */}
        <div className="max-w-lg p-8 mx-auto bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-center text-pink-800">Stay Updated with Baby Care Tips</h2>
          <p className="mb-6 text-center text-pink-700">Subscribe to our newsletter for the latest parenting advice, product updates, and exclusive offers.</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 border border-pink-200 rounded-lg focus:border-pink-500 focus:ring-pink-500 focus:outline-none"
            />
            <button className="px-6 py-3 font-medium text-white transition-colors bg-pink-600 rounded-lg hover:bg-pink-700">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}