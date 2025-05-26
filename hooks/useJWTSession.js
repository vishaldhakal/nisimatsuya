
import { useState, useEffect, useCallback } from 'react';
import { jwtSessionManager } from '../lib/auth/jwtSessionManager';
import { authService } from '../lib/auth/authService';

export const useJWTSession = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current session state
  const refreshSession = useCallback(() => {
    try {
      const currentSession = jwtSessionManager.getSession();
      setSession(currentSession);
      setError(null);
    } catch (err) {
      console.error('Error refreshing session:', err);
      setError(err.message);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    refreshSession();

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = (e) => {
      if (e.key === 'auth_session' || e.key === 'auth_token') {
        refreshSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshSession]);

  // Login function
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await authService.login(credentials);
      refreshSession(); // Update local session state
      
      return result;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    try {
      authService.logout();
      setSession(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
    }
  }, []);

  // Get session info
  const getSessionInfo = useCallback(() => {
    return authService.getSessionInfo();
  }, []);

  // Check if token will expire soon
  const willExpireSoon = useCallback((minutes = 5) => {
    return authService.willExpireSoon(minutes);
  }, []);

  // Manual token refresh
  const refreshToken = async () => {
    try {
      setError(null);
      await authService.refreshToken();
      refreshSession();
    } catch (err) {
      setError(err.message || 'Token refresh failed');
      throw err;
    }
  };

  return {
    // Session data
    session,
    user: session?.user || null,
    token: session?.accessToken || null,
    isAuthenticated: !!session,
    
    // Loading and error states
    isLoading,
    error,
    
    // Actions
    login,
    logout,
    refreshSession,
    refreshToken,
    
    // Utilities
    getSessionInfo,
    willExpireSoon,
    
    // Clear error
    clearError: () => setError(null)
  };
};