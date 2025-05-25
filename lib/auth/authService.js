import axiosInstance from '../api/axiosInstance';

class AuthService {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  async login(credentials) {
    try {
      const response = await axiosInstance.post('/_allauth/browser/v1/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async signup(userData) {
    try {
      const response = await axiosInstance.post('/_allauth/browser/v1/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await axiosInstance.post('/api/logout/');
      this.clearAuthData();
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  async verifyToken(token) {
    try {
      const response = await axiosInstance.post('/api/auth/verify-token/', { token });
      return response.data.isValid;
    } catch (error) {
      return false;
    }
  }

  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  getUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  setAuthData(token, user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  clearAuthData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
}

export const authService = new AuthService();