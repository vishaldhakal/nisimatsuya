
import axiosInstance from '../../lib/api/axiosInstance';

const BLOG_ENDPOINTS = {
  BLOGS: '/api/blogs/',
  BLOG_DETAIL: (slug) => `/api/blogs/${slug}/`,
  CATEGORIES: '/api/blog/categories/',
  TAGS: '/api/blog/tags/',
};

export const blogService = {
  // Get all blogs with pagination and filters
  getBlogs: async (params = {}) => {
    try {
      const response = await axiosInstance.get(BLOG_ENDPOINTS.BLOGS, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch blogs');
    }
  },

  // Get single blog by ID
  getBlogBySlug: async (slug) => {
    try {
      const response = await axiosInstance.get(BLOG_ENDPOINTS.BLOG_DETAIL(slug));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch blog');
    }
  },

  // Create new blog post
  createBlog: async (blogData) => {
    try {
      const formData = new FormData();
      
      // Append basic fields
      Object.keys(blogData).forEach(key => {
        if (key === 'tags' && Array.isArray(blogData[key])) {
          // Handle tags array
          blogData[key].forEach(tag => formData.append('tags', tag));
        } else if (key === 'thumbnail_image' && blogData[key] instanceof File) {
          // Handle file upload
          formData.append(key, blogData[key]);
        } else if (blogData[key] !== null && blogData[key] !== undefined) {
          formData.append(key, blogData[key]);
        }
      });

      const response = await axiosInstance.post(BLOG_ENDPOINTS.BLOGS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create blog');
    }
  },

  // Update blog post
  updateBlog: async (id, blogData) => {
    try {
      const formData = new FormData();
      
      Object.keys(blogData).forEach(key => {
        if (key === 'tags' && Array.isArray(blogData[key])) {
          blogData[key].forEach(tag => formData.append('tags', tag));
        } else if (key === 'thumbnail_image' && blogData[key] instanceof File) {
          formData.append(key, blogData[key]);
        } else if (blogData[key] !== null && blogData[key] !== undefined) {
          formData.append(key, blogData[key]);
        }
      });

      const response = await axiosInstance.put(BLOG_ENDPOINTS.BLOG_DETAIL(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update blog');
    }
  },

  // Delete blog post
  deleteBlog: async (id) => {
    try {
      const response = await axiosInstance.delete(BLOG_ENDPOINTS.BLOG_DETAIL(id));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete blog');
    }
  },

  // Get blog categories
  getCategories: async () => {
    try {
      const response = await axiosInstance.get(BLOG_ENDPOINTS.CATEGORIES);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  },

  // Get blog tags
  getTags: async () => {
    try {
      const response = await axiosInstance.get(BLOG_ENDPOINTS.TAGS);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tags');
    }
  },
};

export default blogService;