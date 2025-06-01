"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="text-2xl font-bold text-gray-800">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </Link>
            {/* Desktop Nav */}
            <nav className="hidden space-x-8 md:flex">
              <a href="/admin" className="text-gray-700 hover:text-gray-900">Dashboard</a>
              <a href="/admin/products" className="text-gray-700 hover:text-gray-900">Products</a>
              <a href="/admin/orders" className="text-gray-700 hover:text-gray-900">Orders</a>
              <a href="/admin/blogs" className="text-gray-700 hover:text-gray-900" onClick={() => setMenuOpen(false)}>Blogs</a>
              <a href="/admin/testimonials" className="text-gray-700 hover:text-gray-900">Testimonials</a>
              <button 
                onClick={() => {
                  localStorage.removeItem('adminAuthenticated');
                  router.push('/admin/login');
                }}
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </nav>
            {/* Mobile Hamburger */}
            <button
              className="flex items-center px-3 py-2 text-gray-700 border border-gray-400 rounded md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {/* Mobile Nav */}
          {menuOpen && (
            <div className="flex flex-col pb-4 space-y-2 md:hidden">
              <a href="/admin" className="text-gray-700 hover:text-gray-900" onClick={() => setMenuOpen(false)}>Dashboard</a>
              <a href="/admin/products" className="text-gray-700 hover:text-gray-900" onClick={() => setMenuOpen(false)}>Products</a>
              <a href="/admin/orders" className="text-gray-700 hover:text-gray-900" onClick={() => setMenuOpen(false)}>Orders</a>
              <a href="/admin/blogs" className="text-gray-700 hover:text-gray-900" onClick={() => setMenuOpen(false)}>Blogs</a>
              <a href="/admin/testimonials" className="text-gray-700 hover:text-gray-900" onClick={() => setMenuOpen(false)}>Testimonials</a>
              <button 
                onClick={() => {
                  localStorage.removeItem('adminAuthenticated');
                  router.push('/admin/login');
                  setMenuOpen(false);
                }}
                className="text-left text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <main className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}