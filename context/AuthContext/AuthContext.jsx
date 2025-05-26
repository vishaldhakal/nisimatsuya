
'use client';

import { createContext, useContext, useEffect, useReducer } from 'react';
import { authService } from '../../lib/auth/authService';
import { jwtSessionManager } from '../../lib/auth/jwtSessionManager';

const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_USER: 'LOAD_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
  TOKEN_REFRESH: 'TOKEN_REFRESH',
  SESSION_UPDATE: 'SESSION_UPDATE',
};

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  isRegistering: false,
  error: null,
  emailVerificationRequired: false,
  sessionInfo: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        emailVerificationRequired: false,
        sessionInfo: action.payload.sessionInfo,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        emailVerificationRequired: false,
        sessionInfo: null,
      };

    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isRegistering: true,
        error: null,
        emailVerificationRequired: false,
      };

    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user || null,
        token: action.payload.token || null,
        refreshToken: action.payload.refreshToken || null,
        isAuthenticated: !action.payload.email_verification_required,
        isRegistering: false,
        error: null,
        emailVerificationRequired: action.payload.email_verification_required || false,
        sessionInfo: action.payload.sessionInfo,
      };

    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isRegistering: false,
        error: action.payload,
        emailVerificationRequired: false,
        sessionInfo: null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        isRegistering: false,
        error: null,
        emailVerificationRequired: false,
        sessionInfo: null,
      };

    case AUTH_ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        emailVerificationRequired: false,
        sessionInfo: action.payload.sessionInfo,
      };

    case AUTH_ACTIONS.TOKEN_REFRESH:
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        sessionInfo: action.payload.sessionInfo,
      };

    case AUTH_ACTIONS.SESSION_UPDATE:
      return {
        ...state,
        sessionInfo: action.payload.sessionInfo,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Helper to get session data
  const getSessionData = () => {
    const session = jwtSessionManager.getSession();
    const sessionInfo = authService.getSessionInfo();
    
    return {
      user: session?.user || null,
      token: session?.accessToken || null,
      refreshToken: session?.refreshToken || null,
      sessionInfo
    };
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        
        // Initialize JWT session manager
        jwtSessionManager.initialize();
        
        const session = jwtSessionManager.getSession();

        if (session && session.accessToken) {
          // Verify token is still valid
          const isValid = await authService.verifyToken(session.accessToken);
          
          if (isValid) {
            const sessionData = getSessionData();
            dispatch({
              type: AUTH_ACTIONS.LOAD_USER,
              payload: sessionData,
            });
          } else {
            // Try to refresh token
            try {
              await authService.refreshToken();
              const refreshedSessionData = getSessionData();
              dispatch({
                type: AUTH_ACTIONS.LOAD_USER,
                payload: refreshedSessionData,
              });
            } catch (refreshError) {
              console.error('Token refresh failed during initialization:', refreshError);
              jwtSessionManager.clearSession();
              dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        jwtSessionManager.clearSession();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    initializeAuth();

    // Listen for storage changes (multi-tab synchronization)
    const handleStorageChange = (e) => {
      if (e.key === 'auth_session' || e.key === 'auth_token') {
        const sessionData = getSessionData();
        if (sessionData.user && sessionData.token) {
          dispatch({
            type: AUTH_ACTIONS.LOAD_USER,
            payload: sessionData,
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      }
    };

    // Listen for custom session events
    const handleSessionUpdate = () => {
      const sessionData = getSessionData();
      dispatch({
        type: AUTH_ACTIONS.SESSION_UPDATE,
        payload: sessionData,
      });
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('jwt-session-updated', handleSessionUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('jwt-session-updated', handleSessionUpdate);
    };
  }, []);

  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await authService.login(credentials);
      const sessionData = getSessionData();
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: sessionData,
      });
      
      return response.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Login failed. Please check your credentials and try again.';
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

  const signup = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });
    
    try {
      const response = await authService.signup(userData);
      const sessionData = getSessionData();
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: {
          ...sessionData,
          email_verification_required: response.email_verification_required,
        },
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Registration failed. Please try again.';
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const verifyEmail = async (token) => {
    try {
      const response = await authService.verifyEmail(token);
      
      if (response.user && response.token) {
        const sessionData = getSessionData();
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: sessionData,
        });
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const resendVerificationEmail = async (email) => {
    try {
      return await authService.resendVerificationEmail(email);
    } catch (error) {
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      await authService.refreshToken();
      const sessionData = getSessionData();
      
      dispatch({
        type: AUTH_ACTIONS.TOKEN_REFRESH,
        payload: sessionData,
      });
      
      return sessionData;
    } catch (error) {
      console.error('Token refresh failed:', error);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Additional utility functions
  const getTimeUntilExpiry = () => {
    return authService.getTimeUntilExpiry();
  };

  const willExpireSoon = (minutes = 5) => {
    return authService.willExpireSoon(minutes);
  };

  const updateSessionInfo = () => {
    const sessionData = getSessionData();
    dispatch({
      type: AUTH_ACTIONS.SESSION_UPDATE,
      payload: sessionData,
    });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    clearError,
    verifyEmail,
    resendVerificationEmail,
    refreshToken,
    getTimeUntilExpiry,
    willExpireSoon,
    updateSessionInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};