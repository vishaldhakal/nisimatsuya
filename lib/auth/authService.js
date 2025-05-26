// lib/auth/authService.js
import axiosInstance from '../api/axiosInstance';

class AuthService {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  async login(credentials) {
    try {
      const response = await axiosInstance.post('/_allauth/browser/v1/auth/login', credentials);
      // Set auth data immediately after successful login
      if (response.data.token && response.data.user) {
        this.setAuthData(response.data.token, response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async signup(userData) {
    try {
      // Format the data according to your backend requirements
      const signupData = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        address: userData.address || ''
      };

      const response = await axiosInstance.post('/_allauth/browser/v1/auth/signup', signupData);
      
      if (response.data.email_verification_required) {
        return {
          ...response.data,
          message: 'Registration successful! Please check your email and click the verification link to activate your account.',
          email_verification_required: true
        };
      }
      if (response.data.token && response.data.user) {
        this.setAuthData(response.data.token, response.data.user);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Simple logout - just clear local storage
  logout() {
    this.clearAuthData();
    // Force redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  async verifyToken(token) {
    try {
      // Add Authorization header for token verification
      const response = await axiosInstance.post('/api/auth/verify-token/',
        { token },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data.isValid;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }

  async verifyEmail(token) {
    try {
      const response = await axiosInstance.post('/_allauth/browser/v1/auth/email/verify', {
        key: token
      });
      
      // After successful email verification, set auth data if provided
      if (response.data.user && response.data.token) {
        this.setAuthData(response.data.token, response.data.user);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async resendVerificationEmail(email) {
    try {
      const response = await axiosInstance.post('/_allauth/browser/v1/auth/email/verify/resend', {
        email
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  getUser() {
    if (typeof window === 'undefined') return null;
    try {
      const user = localStorage.getItem('auth_user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  setAuthData(token, user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      // Also set axios default authorization header
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  clearAuthData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // Clear axios authorization header
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  }

  // Initialize axios with stored token on app start
  initializeAxios() {
    const token = this.getToken();
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
}

export const authService = new AuthService();