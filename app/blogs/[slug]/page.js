'use client';

import { useState, useEffect, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaTags, FaClock, FaFolder, FaShare } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import blogService from '../../../services/api/blogService';

export default function BlogPost({ params }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readingTime, setReadingTime] = useState(0);

  // Sanitize HTML content using DOMPurify
  const sanitizedContent = useMemo(() => {
    if (!blog?.description) return '';
    
    // More permissive DOMPurify configuration for rich text content
    const config = {
      ALLOWED_TAGS: [
        // Headings
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        // Text formatting
        'p', 'br', 'div', 'span', 'section', 'article',
        'strong', 'em', 'b', 'i', 'u', 's', 'sub', 'sup',
        'mark', 'small', 'del', 'ins',
        // Lists
        'ul', 'ol', 'li', 'dl', 'dt', 'dd',
        // Links and media
        'a', 'img', 'figure', 'figcaption',
        // Code and quotes
        'blockquote', 'cite', 'q', 'pre', 'code', 'kbd', 'samp',
        // Tables
        'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
        'colgroup', 'col',
        // Other common elements
        'hr', 'address', 'time'
      ],
      ALLOWED_ATTR: [
        // Links
        'href', 'target', 'rel', 'title',
        // Media
        'src', 'alt', 'width', 'height', 'loading',
        // General
        'class', 'id', 'style', 'data-*',
        // Tables
        'colspan', 'rowspan', 'scope',
        // Lists
        'start', 'type', 'reversed',
        // Time
        'datetime'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      ADD_ATTR: ['target'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onfocus', 'onblur'],
      KEEP_CONTENT: true,
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM: false,
      // Allow data attributes
      ALLOW_DATA_ATTR: true,
      // Don't remove unknown protocols, just sanitize them
      ALLOW_UNKNOWN_PROTOCOLS: false
    };

    try {
      const sanitized = DOMPurify.sanitize(blog.description, config);
      console.log('Original content:', blog.description);
      console.log('Sanitized content:', sanitized);
      return sanitized;
    } catch (error) {
      console.error('DOMPurify sanitization error:', error);
      return blog.description; // Fallback to original content
    }
  }, [blog?.description]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const blogData = await blogService.getBlogBySlug(params.slug);
        setBlog(blogData);
        
        // Calculate reading time (rough estimate)
        if (blogData.description) {
          const wordCount = blogData.description.replace(/<[^>]*>/g, '').split(/\s+/).length;
          setReadingTime(Math.ceil(wordCount / 200)); // Average reading speed
        }
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.meta_description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You might want to show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-pink-500 rounded-full animate-spin border-t-transparent"></div>
            <p className="text-lg font-medium text-gray-700">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-md p-8 mx-4 text-center bg-white rounded-lg shadow-lg">
            <div className="w-16 h-16 mx-auto mb-4 text-4xl">😞</div>
            <h2 className="mb-2 text-xl font-bold text-gray-800">Article Not Found</h2>
            <p className="mb-6 text-gray-600">{error}</p>
            <Link 
              href="/blogs" 
              className="inline-flex items-center px-6 py-3 font-medium text-white transition-colors bg-pink-600 rounded-lg hover:bg-pink-700"
            >
              <FaArrowLeft className="mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl p-6 px-4 mx-auto">
        
        {/* Header with Back Button and Share */}
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-gray-200">
          <Link 
            href="/blogs" 
            className="inline-flex items-center px-4 py-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FaArrowLeft className="mr-2 text-sm" /> 
            Back to Blog
          </Link>
          
          <button
            onClick={handleShare}
            className="inline-flex items-center px-4 py-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FaShare className="mr-2 text-sm" />
            Share
          </button>
        </div>

        {/* Article Header */}
        <div className="mb-8 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          
          {/* Featured Image */}
          {blog.thumbnail_image && (
            <div className="relative w-full h-64 md:h-80">
              <Image 
                src={blog.thumbnail_image} 
                alt={blog.thumbnail_image_alt_description || blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          )}
          
          <div className="p-6 md:p-8">
            {/* Category Badge */}
            {blog.category && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-pink-700 bg-pink-100 rounded-full">
                  <FaFolder className="mr-1 text-xs" />
                  {blog.category.title}
                </span>
              </div>
            )}
            
            {/* Title */}
            <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              {blog.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 md:gap-6">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-pink-500" />
                <span>{formatDate(blog.created_at)}</span>
              </div>
              
              {readingTime > 0 && (
                <div className="flex items-center">
                  <FaClock className="mr-2 text-pink-500" />
                  <span>{readingTime} min read</span>
                </div>
              )}
              
              {blog.author && (
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 mr-2 bg-pink-500 rounded-full">
                    <FaUser className="text-xs text-white" />
                  </div>
                  <span>
                    {typeof blog.author === 'object' 
                      ? `${blog.author.first_name || ''} ${blog.author.last_name || ''}`.trim() || blog.author.username
                      : blog.author
                    }
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span 
                    key={tag.id} 
                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 transition-colors bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    <FaTags className="mr-1 text-xs text-pink-400" />
                    {tag.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 md:p-8">
            {blog.description ? (
              <div 
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-pink-600 hover:prose-a:text-pink-800 prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-blockquote:border-pink-300 prose-blockquote:bg-pink-50 prose-img:rounded-lg prose-img:shadow-md"
              />
            ) : (
              <div className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-4xl">✨</div>
                <h3 className="mb-4 text-xl font-bold text-gray-800">Content Coming Soon</h3>
                <p className="max-w-md mx-auto text-gray-600">
                  This article is being crafted with care. Check back soon for the complete content.
                </p>
              </div>
            )}
            
            {/* Updated Info */}
            {blog.updated_at !== blog.created_at && (
              <div className="pt-6 mt-8 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-2 text-pink-400" />
                  <span>Last updated on {formatDate(blog.updated_at)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="mt-8 text-center">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-3 text-xl font-bold text-gray-800">Explore More Stories</h3>
            <p className="mb-6 text-gray-600">Discover more insights and tips for your journey</p>
            <Link 
              href="/blogs" 
              className="inline-flex items-center px-6 py-3 font-semibold text-white transition-colors bg-pink-600 rounded-lg hover:bg-pink-700"
            >
              Browse All Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}