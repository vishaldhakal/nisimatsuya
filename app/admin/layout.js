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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/admin" className="text-2xl font-bold text-gray-800"><h1 className="text-xl font-bold">Admin Dashboard</h1></Link>
            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              <a href="/admin" className="text-gray-700 hover:text-gray-900">Dashboard</a>
              <a href="/admin/products" className="text-gray-700 hover:text-gray-900">Products</a>
              <a href="/admin/orders" className="text-gray-700 hover:text-gray-900">Orders</a>
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
              className="md:hidden flex items-center px-3 py-2 border rounded text-gray-700 border-gray-400"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {/* Mobile Nav */}
          {menuOpen && (
            <div className="md:hidden flex flex-col space-y-2 pb-4">
              <a href="/admin" className="text-gray-700 hover:text-gray-900" onClick={() => setMenuOpen(false)}>Dashboard</a>
              <a href="/admin/products" className="text-gray-700 hover:text-gray-900" onClick={() => setMenuOpen(false)}>Products</a>
              <a href="/admin/orders" className="text-gray-700 hover:text-gray-900" onClick={() => setMenuOpen(false)}>Orders</a>
              <button 
                onClick={() => {
                  localStorage.removeItem('adminAuthenticated');
                  router.push('/admin/login');
                  setMenuOpen(false);
                }}
                className="text-red-600 hover:text-red-800 text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}