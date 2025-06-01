
import axiosInstance from '../api/axiosInstance';
import { jwtSessionManager } from './jwtSessionManager';

class AuthService {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    this.setupAxiosInterceptors();
  }

  // Setup axios interceptors for automatic token handling
  setupAxiosInterceptors() {
    // Request interceptor to add token
    axiosInstance.interceptors.request.use(
      (config) => {
        const token = jwtSessionManager.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token expiration
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = jwtSessionManager.getRefreshToken();
            if (refreshToken && !jwtSessionManager.isTokenExpired(refreshToken)) {
              // Try to refresh the token
              const newTokens = await this.refreshToken();
              
              // Update the failed request with new token
              originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
              
              return axiosInstance(originalRequest);
            } else {
              // Refresh token is invalid, logout user
              this.logout();
              return Promise.reject(error);
            }
          } catch (refreshError) {
            this.logout();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async login(credentials) {
    try {
      const response = await axiosInstance.post('/_allauth/browser/v1/auth/login', credentials);
      
      // Handle the response structure from your JSON
      if (response.data && response.data.data && response.data.data.user) {
        const tokenData = {
          access_token: response.data.data.user.access_token,
          refresh_token: response.data.data.user.refresh_token,
          user: {
            id: response.data.data.user.id,
            email: response.data.data.user.email,
            display: response.data.data.user.display,
            username: response.data.data.user.username,
            has_usable_password: response.data.data.user.has_usable_password
          }
        };

        // Set session using JWT session manager
        jwtSessionManager.setSession(tokenData);
        
        return {
          user: tokenData.user,
          token: tokenData.access_token,
          ...response.data
        };
      }
      
      // Fallback for different response structure
      if (response.data.token && response.data.user) {
        const tokenData = {
          access_token: response.data.token,
          refresh_token: response.data.refresh_token,
          user: response.data.user
        };
        
        jwtSessionManager.setSession(tokenData);
        return response.data;
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signup(userData) {
    try {
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

      // If signup is successful and returns tokens
      if (response.data.token && response.data.user) {
        const tokenData = {
          access_token: response.data.token,
          refresh_token: response.data.refresh_token,
          user: response.data.user
        };
        
        jwtSessionManager.setSession(tokenData);
      }
      
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async refreshToken() {
    const refreshToken = jwtSessionManager.getRefreshToken();
    if (!refreshToken || jwtSessionManager.isTokenExpired(refreshToken)) {
      throw new Error('No valid refresh token available');
    }

    const accessToken = jwtSessionManager.getAccessToken();
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: jwtSessionManager.getUser()
    };
  }

  logout() {
    // Clear session
    jwtSessionManager.clearSession();
    
    // Force redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Only check expiry on frontend, no backend call
  async verifyToken(token) {
    return !jwtSessionManager.isTokenExpired(token);
  }

  async verifyEmail(token) {
    try {
      const response = await axiosInstance.post('/_allauth/browser/v1/auth/email/verify', {
        key: token
      });
      
      if (response.data.user && response.data.token) {
        const tokenData = {
          access_token: response.data.token,
          refresh_token: response.data.refresh_token,
          user: response.data.user
        };
        
        jwtSessionManager.setSession(tokenData);
      }
      
      return response.data;
    } catch (error) {
      console.error('Email verification failed:', error);
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
      console.error('Resend verification failed:', error);
      throw error;
    }
  }

  // Updated methods to use JWT session manager
  isAuthenticated() {
    return jwtSessionManager.isAuthenticated();
  }

  getToken() {
    return jwtSessionManager.getAccessToken();
  }

  getUser() {
    return jwtSessionManager.getUser();
  }

  getSessionInfo() {
    return jwtSessionManager.getSessionInfo();
  }

  // Backward compatibility methods
  setAuthData(token, user) {
    const tokenData = {
      access_token: token,
      refresh_token: null, // Will be set if available
      user: user
    };
    jwtSessionManager.setSession(tokenData);
  }

  clearAuthData() {
    jwtSessionManager.clearSession();
  }

  initializeAxios() {
    // This is now handled by the interceptors
    const token = this.getToken();
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  // New utility methods
  getTokenExpiry() {
    const sessionInfo = this.getSessionInfo();
    return sessionInfo ? sessionInfo.tokenExpiry : null;
  }

  getTimeUntilExpiry() {
    const expiry = this.getTokenExpiry();
    if (!expiry) return null;
    
    const now = new Date();
    return expiry.getTime() - now.getTime();
  }

  willExpireSoon(minutes = 5) {
    const timeUntilExpiry = this.getTimeUntilExpiry();
    if (!timeUntilExpiry) return false;
    
    return timeUntilExpiry <= (minutes * 60 * 1000);
  }
}

export const authService = new AuthService();