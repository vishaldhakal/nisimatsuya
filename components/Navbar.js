"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCart } from "../components/Cart/CartContext";
import { ShoppingBag } from "lucide-react";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const { totalItems } = useCart();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close dropdown when toggling the menu
    setIsMobileDropdownOpen(false);
  };

  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const categories = [
    { name: "Baby Clothing", href: "/category/clothing" },
    { name: "Baby Toys", href: "/category/toys" },
    { name: "Baby Care", href: "/category/care" },
    { name: "Baby Food", href: "/category/food" },
    { name: "Baby Furniture", href: "/category/furniture" },
    { name: "Baby Accessories", href: "/category/accessories" },
  ];

  return (
    <nav className="bg-white shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Nishimatsuya Logo"
              width={100}
              height={100}
              className="rounded-full"
            />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 text-base font-medium">
          <Link
            href="/"
            className="hover:text-pink-600 text-gray-900 transition"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="hover:text-pink-600 text-gray-900 transition"
          >
            Products
          </Link>
          <div
            className="relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={dropdownRef}
          >
            <button className="flex items-center gap-1 hover:text-pink-600 text-gray-900 transition">
              Categories
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`absolute top-full left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out z-50 ${
                isDropdownOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="py-1" role="menu">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-150"
                    role="menuitem"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link
            href="/about"
            className="hover:text-pink-600 text-gray-900 transition"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="hover:text-pink-600 text-gray-900 transition"
          >
            Contact
          </Link>
          <Link
            href="/blogs"
            className="hover:text-pink-600 text-gray-900 transition"
          >
            Blogs
          </Link>
        </div>
        
        <div className="flex gap-4 items-center">
          {/* Desktop Auth Links */}
          <div className="hidden md:flex items-center">
            <Link
              href="/login"
              className="text-pink-700 hover:text-pink-900 font-semibold"
            >
              Login
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/register"
              className="text-pink-700 hover:text-pink-900 font-semibold"
            >
              Register
            </Link>
          </div>
          
          {/* Cart Icon (visible on all screens) */}
          <Link href="/cart" className="ml-0 md:ml-4 relative">
            <ShoppingBag className="w-6 h-6 text-pink-600" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden ml-2 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            onClick={toggleMobileMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`mobile-menu-container fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
              <button 
                onClick={toggleMobileMenu}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-gray-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-2">
              <div className="flex flex-col">
                <Link
                  href="/"
                  className="px-4 py-3 hover:bg-pink-50 text-gray-900 hover:text-pink-600 transition"
                  onClick={toggleMobileMenu}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="px-4 py-3 hover:bg-pink-50 text-gray-900 hover:text-pink-600 transition"
                  onClick={toggleMobileMenu}
                >
                  Products
                </Link>
                
                {/* Mobile Categories Dropdown */}
                <div className="flex flex-col">
                  <button 
                    onClick={toggleMobileDropdown}
                    className="px-4 py-3 flex justify-between items-center text-left hover:bg-pink-50 text-gray-900 hover:text-pink-600 transition"
                  >
                    <span>Categories</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isMobileDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isMobileDropdownOpen ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block px-8 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-150"
                        onClick={toggleMobileMenu}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <Link
                  href="/about"
                  className="px-4 py-3 hover:bg-pink-50 text-gray-900 hover:text-pink-600 transition"
                  onClick={toggleMobileMenu}
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="px-4 py-3 hover:bg-pink-50 text-gray-900 hover:text-pink-600 transition"
                  onClick={toggleMobileMenu}
                >
                  Contact
                </Link>
                <Link
                  href="/blogs"
                  className="px-4 py-3 hover:bg-pink-50 text-gray-900 hover:text-pink-600 transition"
                  onClick={toggleMobileMenu}
                >
                  Blogs
                </Link>
              </div>
            </div>
            
            {/* Mobile Auth Footer */}
            <div className="p-4 border-t flex justify-center space-x-4">
              <Link
                href="/login"
                className="text-pink-700 hover:text-pink-900 font-semibold"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href="/register"
                className="text-pink-700 hover:text-pink-900 font-semibold"
                onClick={toggleMobileMenu}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}