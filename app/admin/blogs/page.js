
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import blogService from '../../../services/api/blogService';
import {
  BlogsTable,
  BlogsHeader,
  BlogsSearch,
} from '../../../components/features/admin/blogs';

const BlogsManagement = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  
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
    fetchBlogs();
    fetchCategories();
  }, [searchTerm, filters, pagination.currentPage]);

  const fetchBlogs = async () => {
  try {
    setLoading(true);
    const params = {
      page: pagination.currentPage,
      ...(searchTerm && { search: searchTerm }), // Only include search if it has a value
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

  const handleTogglePublish = async (blog) => {
    try {
      const updatedData = { is_published: !blog.is_published };
      await blogService.updateBlog(blog.id, updatedData);
      toast.success(`Blog ${updatedData.is_published ? 'published' : 'unpublished'} successfully!`);
      fetchBlogs();
    } catch (error) {
      toast.error(error.message || 'Failed to update blog status');
      console.error('Error toggling publish status:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedBlogs.length} selected blogs?`)) {
      return;
    }

    try {
      await Promise.all(selectedBlogs.map(blogId => blogService.deleteBlog(blogId)));
      toast.success(`${selectedBlogs.length} blogs deleted successfully!`);
      setSelectedBlogs([]);
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete some blogs');
      console.error('Error bulk deleting blogs:', error);
    }
  };

  const handleBulkPublish = async () => {
    try {
      const selectedBlogObjects = blogs.filter(blog => selectedBlogs.includes(blog.id));
      await Promise.all(
        selectedBlogObjects.map(blog => 
          blogService.updateBlog(blog.id, { is_published: true })
        )
      );
      toast.success(`${selectedBlogs.length} blogs published successfully!`);
      setSelectedBlogs([]);
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to publish some blogs');
      console.error('Error bulk publishing blogs:', error);
    }
  };

  const handleBulkUnpublish = async () => {
    try {
      const selectedBlogObjects = blogs.filter(blog => selectedBlogs.includes(blog.id));
      await Promise.all(
        selectedBlogObjects.map(blog => 
          blogService.updateBlog(blog.id, { is_published: false })
        )
      );
      toast.success(`${selectedBlogs.length} blogs unpublished successfully!`);
      setSelectedBlogs([]);
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to unpublish some blogs');
      console.error('Error bulk unpublishing blogs:', error);
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

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
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
          onTogglePublish={handleTogglePublish}
          isLoading={loading}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="flex justify-between flex-1 sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevious}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
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