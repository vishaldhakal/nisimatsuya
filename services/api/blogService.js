import axiosInstance from '../../lib/api/axiosInstance'; 

const BLOG_ENDPOINTS = {
  BLOGS: '/api/blogs/',
  BLOG_DETAIL: (slug) => `/api/blogs/${slug}/`,
  CATEGORIES: '/api/blog/categories/',
  TAGS: '/api/blog/tags/',
  CREATE_TAG: '/api/blog/tags/', 
};

function formatDRFErrors(errorData) {
  if (!errorData) return 'An unknown error occurred.';
  if (typeof errorData === 'string') return errorData; 
  if (errorData.detail) return errorData.detail; 

  let messages = [];
  for (const key in errorData) {
    if (errorData.hasOwnProperty(key)) {
      const fieldErrors = Array.isArray(errorData[key]) ? errorData[key] : [errorData[key]];
      messages.push(`${key}: ${fieldErrors.join(', ')}`);
    }
  }
  return messages.join('; ') || 'Failed to process request. Please check your input.';
}

export const blogService = {
  getBlogs: async (params = {}) => {
    try {
      const response = await axiosInstance.get(BLOG_ENDPOINTS.BLOGS, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error.response?.data || error.message);
      throw new Error(formatDRFErrors(error.response?.data) || 'Failed to fetch blogs');
    }
  },

  getBlogBySlug: async (slug) => {
    try {
      const response = await axiosInstance.get(BLOG_ENDPOINTS.BLOG_DETAIL(slug));
      return response.data;
    } catch (error) {
      console.error('Error fetching blog by slug:', error.response?.data || error.message);
      throw new Error(formatDRFErrors(error.response?.data) || 'Failed to fetch blog');
    }
  },

  createBlog: async (blogData) => { 
    try {
      const formData = new FormData();
      
      for (const key in blogData) {
        if (blogData.hasOwnProperty(key)) {
          const value = blogData[key];

          if (key === 'tags_id' && Array.isArray(value)) {
            value.forEach(tagId => {
              formData.append('tags_id', tagId);
            });
          } else if (value instanceof File) {
            formData.append(key, value);
          } else if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        }
      }

      const response = await axiosInstance.post(BLOG_ENDPOINTS.BLOGS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating blog:', error.response?.data || error.message, error.response?.status);
      throw new Error(formatDRFErrors(error.response?.data) || 'Failed to create blog');
    }
  },

  updateBlog: async (slug, blogData) => { 
    try {
      const formData = new FormData();
      
      for (const key in blogData) {
        if (blogData.hasOwnProperty(key)) {
          const value = blogData[key];

          if (key === 'tags_id' && Array.isArray(value)) {
            value.forEach(tagId => {
              formData.append('tags_id', tagId);
            });
          } else if (key === 'thumbnail_image' && value instanceof File) {
            formData.append(key, value);
          } else if (value !== null && value !== undefined && !(key === 'thumbnail_image' && value === null)) {
            formData.append(key, value);
          }
        }
      }
      
      const response = await axiosInstance.put(BLOG_ENDPOINTS.BLOG_DETAIL(slug), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating blog:', error.response?.data || error.message, error.response?.status);
      throw new Error(formatDRFErrors(error.response?.data) || 'Failed to update blog');
    }
  },

  deleteBlog: async (slug) => { 
    try {
      const response = await axiosInstance.delete(BLOG_ENDPOINTS.BLOG_DETAIL(slug));
      return response.data; 
    } catch (error) {
      console.error('Error deleting blog:', error.response?.data || error.message);
      throw new Error(formatDRFErrors(error.response?.data) || 'Failed to delete blog');
    }
  },

  getCategories: async () => {
    try {
      const response = await axiosInstance.get(BLOG_ENDPOINTS.CATEGORIES);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error.response?.data || error.message);
      throw new Error(formatDRFErrors(error.response?.data) || 'Failed to fetch categories');
    }
  },

  getTags: async () => {
    try {
      const response = await axiosInstance.get(BLOG_ENDPOINTS.TAGS);
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error.response?.data || error.message);
      throw new Error(formatDRFErrors(error.response?.data) || 'Failed to fetch tags');
    }
  },

  // New method to create tags
  createTag: async (tagData) => {
    try {
      const response = await axiosInstance.post(BLOG_ENDPOINTS.CREATE_TAG, tagData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating tag:', error.response?.data || error.message);
      throw new Error(formatDRFErrors(error.response?.data) || 'Failed to create tag');
    }
  },
};

export default blogService;