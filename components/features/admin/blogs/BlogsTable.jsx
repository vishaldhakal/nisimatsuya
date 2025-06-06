import React from 'react';

const BlogsTable = ({ 
  blogs, 
  selectedBlogs = [], 
  onSelectBlogs, 
  onEdit, 
  onDelete,  
  isLoading 
}) => {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectBlogs(blogs.map(blog => blog.id));
    } else {
      onSelectBlogs([]);
    }
  };

  const handleSelectBlog = (blogId) => {
    if (selectedBlogs.includes(blogId)) {
      onSelectBlogs(selectedBlogs.filter(id => id !== blogId));
    } else {
      onSelectBlogs([...selectedBlogs, blogId]);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-center h-32 sm:h-64">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full sm:w-8 sm:h-8 animate-spin"></div>
            <span className="text-sm text-gray-600 sm:text-base">Loading blogs...</span>
          </div>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-center h-32 px-4 sm:h-64">
          <div className="mb-3 text-gray-400 sm:mb-4">
            <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mb-2 text-base font-medium text-gray-900 sm:text-lg">No blogs found</h3>
          <p className="max-w-xs text-sm text-center text-gray-500 sm:text-base">
            Get started by creating your first blog post.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card Layout (hidden on sm and up) */}
      <div className="space-y-3 sm:hidden">
        {blogs.map((blog) => (
          <div key={blog.id} className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Card Header with Image and Title */}
            <div className="p-3">
              <div className="flex items-start space-x-3">
                {blog.thumbnail_image && (
                  <div className="flex-shrink-0">
                    <img
                      className="object-cover w-12 h-12 rounded-md"
                      src={blog.thumbnail_image}
                      alt={blog.thumbnail_image_alt_description || blog.title}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="mb-1 text-sm font-medium leading-tight text-gray-900 line-clamp-2">
                    {blog.title}
                  </h3>
                  {blog.meta_title && (
                    <p className="text-xs text-gray-500 line-clamp-1">
                      SEO: {blog.meta_title}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="px-3 pb-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col space-y-1">
                  {blog.category ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit">
                      {blog.category.title}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">No category</span>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex justify-end pt-2 space-x-2 border-t border-gray-100">
                <button
                  onClick={() => onEdit(blog)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 active:bg-blue-200 touch-manipulation"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(blog)}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 active:bg-red-200 touch-manipulation"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout (hidden on mobile) */}
      <div className="hidden overflow-hidden bg-white rounded-lg shadow-sm sm:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase lg:px-6">
                  Title
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase lg:px-6">
                  Category
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase lg:px-6">
                  Created
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase lg:px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 lg:px-6">
                    <div className="flex items-center">
                      {blog.thumbnail_image && (
                        <div className="flex-shrink-0 w-10 h-10 mr-4">
                          <img
                            className="object-cover w-10 h-10 rounded-lg"
                            src={blog.thumbnail_image}
                            alt={blog.thumbnail_image_alt_description || blog.title}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {blog.title}
                        </div>
                        {blog.meta_title && (
                          <div className="text-sm text-gray-500 truncate">
                            SEO: {blog.meta_title}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 lg:px-6 whitespace-nowrap">
                    {blog.category ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {blog.category.title}
                      </span>
                    ) : (
                      <span className="text-gray-400">No category</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 lg:px-6 whitespace-nowrap">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium lg:px-6 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(blog)}
                        className="px-2 py-1 text-blue-600 rounded hover:text-blue-900 hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(blog)}
                        className="px-2 py-1 text-red-600 rounded hover:text-red-900 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BlogsTable;