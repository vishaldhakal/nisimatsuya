'use client';

import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { authService } from '../../lib/auth/authService';

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
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isRegistering: false,
  error: null,
  emailVerificationRequired: false,
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
        isAuthenticated: true,
        isLoading: false,
        error: null,
        emailVerificationRequired: false,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        emailVerificationRequired: false,
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
        isAuthenticated: !action.payload.email_verification_required,
        isRegistering: false,
        error: null,
        emailVerificationRequired: action.payload.email_verification_required || false,
      };

    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isRegistering: false,
        error: action.payload,
        emailVerificationRequired: false,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isRegistering: false,
        error: null,
        emailVerificationRequired: false,
      };

    case AUTH_ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        emailVerificationRequired: false,
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        
        // Initialize axios with stored token
        authService.initializeAxios();
        
        const token = authService.getToken();
        const user = authService.getUser();

        if (token && user) {
          // Verify token is still valid
          const isValid = await authService.verifyToken(token);
          
          if (isValid) {
            dispatch({
              type: AUTH_ACTIONS.LOAD_USER,
              payload: { user, token },
            });
          } else {
            // Token is invalid, clear auth data
            authService.clearAuthData();
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.clearAuthData();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    // On mount, load user from localStorage
    const storedUser = authService.getUser();
    if (storedUser) {
      setUser(storedUser);
      authService.initializeAxios();
    }

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await authService.login(credentials);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: response.user, token: response.token },
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
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: response,
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
        authService.setAuthData(response.token, response.user);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: response.user, token: response.token },
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

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    clearError,
    verifyEmail,
    resendVerificationEmail,
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