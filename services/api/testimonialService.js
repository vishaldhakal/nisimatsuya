import axiosInstance from '../../lib/api/axiosInstance';

class TestimonialService {
  // Get all testimonials
  async getTestimonials() {
    try {
      const response = await axiosInstance.get('/api/testimonials/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch testimonials'
      };
    }
  }

  // Get single testimonial
  async getTestimonial(id) {
    try {
      const response = await axiosInstance.get(`/api/testimonials/${id}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch testimonial'
      };
    }
  }

  // Create testimonial
  async createTestimonial(testimonialData) {
    try {
      const formData = new FormData();
      
      Object.keys(testimonialData).forEach(key => {
        if (testimonialData[key] !== null && testimonialData[key] !== undefined) {
          formData.append(key, testimonialData[key]);
        }
      });

      const response = await axiosInstance.post('/api/testimonials/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create testimonial'
      };
    }
  }

  // Update testimonial
  async updateTestimonial(id, testimonialData) {
    try {
      const formData = new FormData();
      
      Object.keys(testimonialData).forEach(key => {
        if (testimonialData[key] !== null && testimonialData[key] !== undefined) {
          formData.append(key, testimonialData[key]);
        }
      });

      const response = await axiosInstance.put(`/api/testimonials/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update testimonial'
      };
    }
  }

  // Delete testimonial
  async deleteTestimonial(id) {
    try {
      await axiosInstance.delete(`/api/testimonials/${id}/`);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete testimonial'
      };
    }
  }
}

// Export both named and default exports to avoid import issues
export const testimonialService = new TestimonialService();
export default testimonialService;