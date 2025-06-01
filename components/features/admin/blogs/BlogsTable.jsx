// components/features/admin/blogs/BlogsTable.jsx
import React from 'react';

const BlogsTable = ({ 
  blogs, 
  selectedBlogs = [], 
  onSelectBlogs, 
  onEdit, 
  onDelete, 
  onTogglePublish, 
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
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading blogs...</span>
          </div>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="mb-4 text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">No blogs found</h3>
          <p className="text-center text-gray-500">
            Get started by creating your first blog post.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
             
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Category
              </th>
              
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Created
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedBlogs.includes(blog.id)}
                    onChange={() => handleSelectBlog(blog.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
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
                    <div>
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
                <td className="px-6 py-4 whitespace-nowrap">
                  {blog.category ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {blog.category.title}
                    </span>
                  ) : (
                    <span className="text-gray-400">No category</span>
                  )}
                </td>
                
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {new Date(blog.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
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
  );
};

export default BlogsTable;