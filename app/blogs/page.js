'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaUser, FaTags, FaArrowRight, FaClock } from 'react-icons/fa';
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 mx-auto border-4 border-pink-200 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-lg font-medium text-pink-700 animate-pulse">
            Loading amazing content...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="p-8 text-center bg-white shadow-2xl rounded-2xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <span className="text-2xl">😔</span>
          </div>
          <p className="mb-4 text-lg text-red-600">Oops! Something went wrong</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 text-white transition-all duration-300 transform rounded-lg shadow-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50">

      <div className="relative px-4 py-16 mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="mb-20 text-center">
          
          
          <h1 className="mb-6 text-5xl font-bold leading-tight text-transparent md:text-6xl lg:text-7xl bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500 bg-clip-text">
            Nishimatsuya
            <span className="block mt-2 text-4xl md:text-5xl lg:text-6xl"> Blog</span>
          </h1>
          
          <p className="max-w-3xl mx-auto mb-8 text-xl leading-relaxed text-gray-600 md:text-2xl">
            Expert advice, heartwarming stories, and practical tips for the beautiful journey of parenthood
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400">
                <span className="text-xs font-bold text-white">{blogs.length}</span>
              </div>
              {blogs.length === 1 ? 'Article' : 'Articles'} Available
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center">
              <FaClock className="mr-1 text-pink-400" />
              Updated Weekly
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {blogs.length === 0 ? (
          <div className="py-20 text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100">
              <span className="text-4xl">✨</span>
            </div>
            <h3 className="mb-2 text-2xl font-semibold text-gray-700">Amazing Content Coming Soon</h3>
            <p className="max-w-md mx-auto text-gray-500">We're preparing wonderful articles for you. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, index) => (
              <article 
                key={blog.id} 
                className="overflow-hidden transition-all duration-500 transform bg-white border border-gray-100 shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image Container with Overlay */}
                <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
                  {blog.thumbnail_image ? (
                    <Image 
                      src={blog.thumbnail_image} 
                      alt={blog.thumbnail_image_alt_description || blog.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="text-center text-gray-300">
                        <div className="mb-3 text-5xl">📖</div>
                        <p className="text-sm font-medium">Story Awaits</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-white rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-rose-500 backdrop-blur-sm">
                      {blog.category?.title || 'Featured'}
                    </span>
                  </div>
                  
                  {/* Read More Overlay */}
                  <div className="absolute inset-0 flex items-end justify-center pb-6 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:opacity-100">
                    <div className="flex items-center font-medium text-white">
                      <span className="mr-2">Read Article</span>
                      <FaArrowRight className="transition-transform duration-300 transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h2 className="mb-3 text-xl font-bold leading-tight text-gray-800 transition-colors duration-300 line-clamp-2 group-hover:text-pink-600">
                    <Link href={`/blogs/${blog.slug}`} className="hover:underline">
                      {blog.title}
                    </Link>
                  </h2>
                  
                  <p className="mb-4 leading-relaxed text-gray-600 line-clamp-3">
                    {blog.meta_description || 'Discover insights and tips in this carefully crafted article...'}
                  </p>
                  
                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag.id} 
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-pink-600 transition-colors duration-200 border border-pink-100 rounded-md bg-pink-50 hover:bg-pink-100"
                        >
                          #{tag.title}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="self-center text-xs text-gray-400">
                          +{blog.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between pt-4 text-sm text-gray-500 border-t border-gray-100">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-pink-400" />
                      <span>{formatDate(blog.created_at)}</span>
                    </div>
                    {blog.author && (
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400">
                          <FaUser className="text-xs text-white" />
                        </div>
                        <span className="font-medium">
                          {typeof blog.author === 'object' 
                            ? `${blog.author.first_name || ''} ${blog.author.last_name || ''}`.trim() || blog.author.username
                            : blog.author
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        
        {/* Call to Action */}
        {blogs.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-6 py-3 text-sm font-medium text-pink-600 transition-all duration-300 transform bg-white border-2 border-pink-200 rounded-full shadow-lg hover:shadow-xl hover:scale-105">
              <span className="w-2 h-2 mr-3 bg-pink-500 rounded-full animate-pulse"></span>
              More articles coming soon
            </div>
          </div>
        )}
      </div>
    </div>
  );
}