
import React from 'react';

const BlogsHeader = ({ onCreateNew, blogsCount }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your blog posts, categories, and content.
            {blogsCount !== undefined && (
              <span className="ml-2 text-sm font-medium text-blue-600">
                {blogsCount} total blogs
              </span>
            )}
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="w-5 h-5 mr-2 -ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create New Blog
        </button>
      </div>
    </div>
  );
};

export default BlogsHeader;