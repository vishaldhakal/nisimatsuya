// services/api/dashboardService.js
import axiosInstance from '../../lib/api/axiosInstance';

class DashboardService {
  /**
   * Fetch dashboard statistics from the API
   * @returns {Promise<Object>} Dashboard stats object
   */
  async getDashboardStats() {
    try {
      const response = await axiosInstance.get('/api/dashboard-stats/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Dashboard stats API error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch dashboard stats'
      };
    }
  }

  /**
   * Fetch revenue data from the API
   * @param {string} filterType 
   * @returns {Promise<Object>} 
   */
  async getRevenueData(filterType = 'daily') {
    try {
      const response = await axiosInstance.get(`/api/revenue/?filter=${filterType}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Revenue API error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch revenue data'
      };
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;