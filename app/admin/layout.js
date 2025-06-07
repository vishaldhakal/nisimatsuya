"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if current route is login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem('adminAuthenticated');
        const authTime = localStorage.getItem('adminAuthTime');
        const currentTime = Date.now();
        
        // Check if auth is valid and not expired (optional: add session timeout)
        const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours
        const isValidAuth = authStatus === 'true' && 
                           authTime && 
                           (currentTime - parseInt(authTime)) < SESSION_TIMEOUT;

        setIsAuthenticated(isValidAuth);

        // Redirect logic
        if (!isLoginPage && !isValidAuth) {
          // Clear invalid auth data
          localStorage.removeItem('adminAuthenticated');
          localStorage.removeItem('adminAuthTime');
          localStorage.removeItem('adminUser');
          router.push('/admin/login');
        } else if (isLoginPage && isValidAuth) {
          // Already authenticated, redirect to dashboard
          router.push('/admin');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        if (!isLoginPage) {
          router.push('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname, isLoginPage]);

  const handleLogout = () => {
    try {
      // Clear all admin-related data
      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('adminAuthTime');
      localStorage.removeItem('adminUser');
      
      // Close mobile menu
      setMenuOpen(false);
      
      // Update state and redirect
      setIsAuthenticated(false);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if localStorage fails
      window.location.href = '/admin/login';
    }
  };

  // Show loading spinner during auth check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // For login page, don't show navigation
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-100">
        {children}
      </div>
    );
  }

  // For other pages, check authentication
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Access Denied</h2>
            <p className="mb-6 text-gray-600">You need to be logged in to access this page.</p>
            <button
              onClick={() => router.push('/admin/login')}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated layout with navigation
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Navigation */}
      <div className="bg-white shadow">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden space-x-8 md:flex">
              <Link 
                href="/admin" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/admin' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/products" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith('/admin/products')
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Products
              </Link>
              <Link 
                href="/admin/orders" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith('/admin/orders')
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Orders
              </Link>
              <Link 
                href="/admin/blogs" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith('/admin/blogs')
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Blogs
              </Link>
              <Link 
                href="/admin/testimonials" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith('/admin/testimonials')
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Testimonials
              </Link>
              
              {/* User Menu */}
              <div className="flex items-center pl-4 ml-4 space-x-4 border-l border-gray-200">
                <span className="text-sm text-gray-600">
                  Welcome, Admin
                </span>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-red-600 transition-colors rounded-md hover:text-red-800 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </nav>

            {/* Mobile Hamburger */}
            <button
              className="flex items-center px-3 py-2 text-gray-700 border border-gray-300 rounded md:hidden hover:bg-gray-50"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <div className="pb-4 border-t border-gray-200 md:hidden">
              <div className="flex flex-col mt-4 space-y-2">
                <Link 
                  href="/admin" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === '/admin' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/admin/products" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname.startsWith('/admin/products')
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Products
                </Link>
                <Link 
                  href="/admin/orders" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname.startsWith('/admin/orders')
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Orders
                </Link>
                <Link 
                  href="/admin/blogs" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname.startsWith('/admin/blogs')
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Blogs
                </Link>
                <Link 
                  href="/admin/testimonials" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname.startsWith('/admin/testimonials')
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Testimonials
                </Link>
                
                {/* Mobile User Section */}
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    Welcome, Admin
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-sm font-medium text-left text-red-600 transition-colors rounded-md hover:text-red-800 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Click outside to close mobile menu */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-10 md:hidden" 
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}