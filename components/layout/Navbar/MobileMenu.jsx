"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDownIcon, XIcon, User, ShoppingBag, Heart, LogOut } from "lucide-react";

import { useAuth } from "../../../context/AuthContext/AuthContext";
import { useJWTSession } from "../../../hooks/useJWTSession";
import { useWishlist } from "../../../hooks/useWishlist";

// JWT Decode function
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

const UserProfileSection = ({ userInfo, onLogout, onClose, isOpen, onToggle }) => {
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist?.length || 0;

  const handleLinkClick = () => {
    onClose();
  };

  // Get display name and initial consistently
  const displayName = userInfo?.first_name || userInfo?.name || "User";
  const displayInitial = userInfo?.first_name?.[0] || userInfo?.name?.[0] || "U";

  return (
    <div className="border-b">
      {/* User Info Header - Always Visible */}
      <button 
        onClick={onToggle}
        className="w-full px-4 py-3 transition-colors bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 font-bold text-white uppercase rounded-full shadow-md bg-gradient-to-br from-pink-400 to-pink-600">
                {displayInitial}
              </div>
              <div className="absolute w-3 h-3 bg-green-400 border-2 border-white rounded-full -bottom-1 -right-1"></div>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {displayName}
              </h3>
              <p className="text-xs text-gray-600 truncate">{userInfo?.email}</p>
            </div>
          </div>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* User Action Links - Collapsible */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-60' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-3 space-y-1 bg-gradient-to-r from-pink-50 to-purple-50">
          <Link
            href="/profile"
            className="flex items-center px-3 py-2 text-sm text-gray-700 transition-colors rounded-lg hover:bg-white hover:text-pink-600"
            onClick={handleLinkClick}
          >
            <User className="w-4 h-4 mr-3" />
            Profile
          </Link>
          
          <Link
            href="/wishlist"
            className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 transition-colors rounded-lg hover:bg-white hover:text-pink-600"
            onClick={handleLinkClick}
          >
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-3" />
              Wishlist
            </div>
            {wishlistCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-pink-500 rounded-full">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>
          
          <Link
            href="/myorders"
            className="flex items-center px-3 py-2 text-sm text-gray-700 transition-colors rounded-lg hover:bg-white hover:text-pink-600"
            onClick={handleLinkClick}
          >
            <ShoppingBag className="w-4 h-4 mr-3" />
            My Orders
          </Link>
          
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center w-full px-3 py-2 text-sm text-red-600 transition-colors rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MobileMenu({ 
  isOpen, 
  onClose, 
  categories 
}) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { session, logout } = useJWTSession();
  const [userInfo, setUserInfo] = useState(null);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/blogs", label: "Blogs" },
  ];

  // Decode JWT to get user info
  useEffect(() => {
    if (session && typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token') || session.accessToken;
      if (token) {
        const decodedToken = decodeJWT(token);
        if (decodedToken) {
          setUserInfo({
            email: decodedToken.email,
            first_name: decodedToken.first_name,
            last_name: decodedToken.last_name,
            name: decodedToken.name || `${decodedToken.first_name} ${decodedToken.last_name}`.trim(),
            phone: decodedToken.phone,
            address: decodedToken.address,
            user_id: decodedToken.user_id
          });
        }
      }
    }
  }, [session]);

  const handleLinkClick = () => {
    onClose();
    setIsCategoriesOpen(false);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
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
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-500 to-pink-600">
            <h2 className="text-xl font-semibold text-white">Menu</h2>
            <button 
              onClick={onClose}
              className="p-1 transition-colors rounded-md hover:bg-pink-700"
            >
              <XIcon className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* User Profile Section - Show when authenticated */}
          {isAuthenticated && userInfo && (
            <UserProfileSection 
              userInfo={userInfo} 
              onLogout={handleLogout}
              onClose={onClose}
              isOpen={isProfileOpen}
              onToggle={() => setIsProfileOpen(!isProfileOpen)}
            />
          )}
          
          {/* Navigation Links */}
          <div className="flex-1 py-2 overflow-y-auto">
            <div className="flex flex-col">
              {navLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-gray-900 transition hover:bg-pink-50 hover:text-pink-600"
                  onClick={handleLinkClick}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Categories Dropdown */}
              <div className="flex flex-col">
                <button 
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center justify-between px-4 py-3 text-left text-gray-900 transition hover:bg-pink-50 hover:text-pink-600"
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
                      className="block px-8 py-2 text-gray-700 transition-colors duration-150 hover:bg-pink-50 hover:text-pink-600"
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
                  className="px-4 py-3 text-gray-900 transition hover:bg-pink-50 hover:text-pink-600"
                  onClick={handleLinkClick}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Auth Footer - Show when NOT authenticated */}
          {!isAuthenticated && (
            <div className="flex justify-center p-4 space-x-4 border-t">
              <Link
                href="/login"
                className="font-semibold text-pink-700 hover:text-pink-900"
                onClick={handleLinkClick}
              >
                Login
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href="/signup"
                className="font-semibold text-pink-700 hover:text-pink-900"
                onClick={handleLinkClick}
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}