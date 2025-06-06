'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import blogService from '../../../services/api/blogService';

const BlogsTable = dynamic(
  () => import('../../../components/features/admin/blogs').then(mod => ({ default: mod.BlogsTable })),
  { ssr: false, loading: () => <div className="h-40 bg-gray-200 rounded sm:h-64 animate-pulse"></div> }
);

const BlogsHeader = dynamic(
  () => import('../../../components/features/admin/blogs').then(mod => ({ default: mod.BlogsHeader })),
  { ssr: false, loading: () => <div className="h-12 mb-3 bg-gray-200 rounded sm:h-16 sm:mb-4 animate-pulse"></div> }
);

const BlogsSearch = dynamic(
  () => import('../../../components/features/admin/blogs').then(mod => ({ default: mod.BlogsSearch })),
  { ssr: false, loading: () => <div className="h-10 mb-3 bg-gray-200 rounded sm:h-12 sm:mb-4 animate-pulse"></div> }
);

const BlogsManagement = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [mounted, setMounted] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: ''
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    hasNext: false,
    hasPrevious: false
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchBlogs();
      fetchCategories();
    }
  }, [mounted, searchTerm, filters, pagination.currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.category && { category: filters.category }),
        ...(filters.status && { is_published: filters.status === 'published' })
      };

      const response = await blogService.getBlogs(params);
      
      setBlogs(response.results || []);
      setPagination({
        currentPage: pagination.currentPage,
        totalPages: Math.ceil(response.count / 10), 
        totalBlogs: response.count,
        hasNext: !!response.next,
        hasPrevious: !!response.previous
      });
    } catch (error) {
      toast.error(error.message || 'Failed to fetch blogs');
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await blogService.getCategories();
      setCategories(response.results || response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreateNew = () => {
    router.push('/admin/blogs/add');
  };

  const handleEditBlog = (blog) => {
    router.push(`/admin/blogs/edit/${blog.slug}`);
  };

  const handleDeleteBlog = async (blog) => {
    // Safe check for window object
    if (typeof window === 'undefined') return;
    
    if (!window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      return;
    }

    try {
      await blogService.deleteBlog(blog.slug);
      toast.success('Blog deleted successfully!');
      fetchBlogs();
    } catch (error) {
      toast.error(error.message || 'Failed to delete blog');
      console.error('Error deleting blog:', error);
    }
  };


  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Generate pagination buttons for mobile (limited)
  const getPaginationButtons = () => {
    const buttons = [];
    const current = pagination.currentPage;
    const total = pagination.totalPages;
    
    // For mobile: show max 3 buttons
    if (total <= 3) {
      for (let i = 1; i <= total; i++) {
        buttons.push(i);
      }
    } else if (current <= 2) {
      buttons.push(1, 2, 3);
    } else if (current >= total - 1) {
      buttons.push(total - 2, total - 1, total);
    } else {
      buttons.push(current - 1, current, current + 1);
    }
    
    return buttons;
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen py-4 sm:py-8 bg-gray-50">
        <div className="px-3 mx-auto sm:px-4 max-w-7xl lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 mb-3 bg-gray-200 rounded sm:h-16 sm:mb-4"></div>
            <div className="h-10 mb-3 bg-gray-200 rounded sm:h-12 sm:mb-4"></div>
            <div className="h-40 bg-gray-200 rounded sm:h-64"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 bg-gray-50">
      <div className="px-3 mx-auto sm:px-4 max-w-7xl lg:px-8">
        <BlogsHeader 
          onCreateNew={handleCreateNew}
          blogsCount={pagination.totalBlogs}
        />

        <BlogsSearch
          onSearch={handleSearch}
          onFilter={handleFilter}
          categories={categories}
        />

        <BlogsTable
          blogs={blogs}
          selectedBlogs={selectedBlogs}
          onSelectBlogs={setSelectedBlogs}
          onEdit={handleEditBlog}
          onDelete={handleDeleteBlog}
          isLoading={loading}
        />

        {/* Mobile-First Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-4 sm:mt-6">
            {/* Mobile Pagination */}
            <div className="flex flex-col space-y-3 sm:hidden">
              {/* Page Info */}
              <div className="text-center">
                <p className="text-xs text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {pagination.totalBlogs} total blogs
                </p>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevious}
                  className="flex-1 max-w-[80px] px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  Prev
                </button>
                
                {/* Page Numbers - Limited for mobile */}
                {getPaginationButtons().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-xs font-medium border rounded-md touch-manipulation min-w-[36px] ${
                      page === pagination.currentPage
                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="flex-1 max-w-[80px] px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Desktop Pagination */}
            <div className="hidden sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {((pagination.currentPage - 1) * 10) + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * 10, pagination.totalBlogs)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.totalBlogs}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevious}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsManagement;