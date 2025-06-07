"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if already authenticated
  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const authStatus = localStorage.getItem('adminAuthenticated');
        const authTime = localStorage.getItem('adminAuthTime');
        const currentTime = Date.now();
        
        // Check if auth is valid and not expired
        const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours
        const isValidAuth = authStatus === 'true' && 
                           authTime && 
                           (currentTime - parseInt(authTime)) < SESSION_TIMEOUT;

        if (isValidAuth) {
          router.push('/admin');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear potentially corrupted auth data
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminAuthTime');
        localStorage.removeItem('adminUser');
      }
    };

    checkExistingAuth();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate input
      if (!formData.email.trim() || !formData.password.trim()) {
        setError('Please fill in all fields');
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real application, this would be an API call to your backend
      // For now, using simple credential check
      if (formData.email === 'admin' && formData.password === 'admin123') {
        const currentTime = Date.now();
        
        // Set authentication data with timestamp
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminAuthTime', currentTime.toString());
        localStorage.setItem('adminUser', formData.email);
        
        // Additional security: You could also set a session token here
        // localStorage.setItem('adminToken', generateSessionToken());
        
        // Clear form
        setFormData({ email: '', password: '' });
        
        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        setError('Invalid credentials. Please check your email and password.');
        
        // Security: Log failed attempts (in real app, this would go to your backend)
        console.warn('Failed login attempt:', {
          email: formData.email,
          timestamp: new Date().toISOString(),
          ip: 'client-side' // In real app, get from server
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin(e);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="mt-2 text-gray-600">Secure access to admin dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700" htmlFor="email">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="w-full py-3 pl-10 pr-4 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white"
                  placeholder="Enter username"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  required
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full py-3 pl-10 pr-4 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !formData.email.trim() || !formData.password.trim()}
            className="w-full px-4 py-3 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              <>
                <svg className="inline w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="p-3 border rounded-lg border-amber-200 bg-amber-50">
            <p className="text-xs text-amber-800">
              <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Authorized personnel only. All access is monitored.
            </p>
          </div>
          
          
        </div>
      </div>
    </div>
  );
}
 