"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon, XIcon } from "lucide-react";
import UserDropdown from "./UserDropdown";
import { useAuth } from "../../../context/AuthContext/AuthContext";

export default function MobileMenu({ 
  isOpen, 
  onClose, 
  categories 
}) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/blogs", label: "Blogs" },
  ];

  const handleLinkClick = () => {
    onClose();
    setIsCategoriesOpen(false);
  };

  return (
    <div 
      className={`mobile-menu-container fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <XIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          
          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-2">
            <div className="flex flex-col">
              {navLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 hover:bg-pink-50 text-gray-900 hover:text-pink-600 transition"
                  onClick={handleLinkClick}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Categories Dropdown */}
              <div className="flex flex-col">
                <button 
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="px-4 py-3 flex justify-between items-center text-left hover:bg-pink-50 text-gray-900 hover:text-pink-600 transition"
                >
                  <span>Categories</span>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isCategoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isCategoriesOpen ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/products/category/${category.slug}`}
                      className="block px-8 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-150"
                      onClick={handleLinkClick}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              {navLinks.slice(2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 hover:bg-pink-50 text-gray-900 hover:text-pink-600 transition"
                  onClick={handleLinkClick}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Auth Footer */}
          <div className="p-4 border-t flex justify-center space-x-4">
            {isAuthenticated ? (
              <UserDropdown isMobile onClose={onClose} />
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-pink-700 hover:text-pink-900 font-semibold"
                  onClick={handleLinkClick}
                >
                  Login
                </Link>
                <span className="text-gray-400">/</span>
                <Link
                  href="/signup"
                  className="text-pink-700 hover:text-pink-900 font-semibold"
                  onClick={handleLinkClick}
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}