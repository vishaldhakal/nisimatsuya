// lib/authService.js
import axiosInstance from './axiosInstance';

export const getGoogleAuthURL = async () => {
  try {
    const response = await axiosInstance.get('/api/auth/google/url/');
    return response.data.url;
  } catch (error) {
    console.error('Error getting Google auth URL:', error);
    throw error;
  }
};

export const loginWithGoogle = async (code) => {
  try {
    const response = await axiosInstance.post('/api/auth/google/', {
      code,
      redirect_uri: 'http://localhost:3000/api/auth/callback/google'
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in with Google:', error);
    throw error;
  }
};

export const loginWithEmailPassword = async (email, password) => {
  try {
    const response = await axiosInstance.post('/_allauth/login/', {
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in with email/password:', error);
    throw error;
  }
};

export const registerWithEmailPassword = async (userData) => {
  try {
    const response = await axiosInstance.post('/_allauth/signup/', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post('/_allauth/logout/');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};