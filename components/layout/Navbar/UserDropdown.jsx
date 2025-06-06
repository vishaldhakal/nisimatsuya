import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext/AuthContext";
import { useWishlist } from "../../../hooks/useWishlist"; 

export default function UserDropdown({ isMobile = false, onClose }) {
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist(); // Get wishlist data
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayName = user?.firstName || user?.name || "Profile";
  const displayInitial = user?.firstName?.[0] || user?.name?.[0] || "U";

  // Get wishlist count
  const wishlistCount = wishlist?.length || 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open]);

  if (isMobile) {
    // Always open in mobile menu
    return (
      <div className="flex flex-col p-4 space-y-1 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3 font-semibold text-gray-900">
          <div className="relative">
            <span className="flex items-center justify-center w-10 h-10 font-bold text-white uppercase rounded-full shadow-md bg-gradient-to-br from-pink-400 to-pink-600">
              {displayInitial}
            </span>
            <div className="absolute w-3 h-3 bg-green-400 border-2 border-white rounded-full -bottom-1 -right-1"></div>
          </div>
          <div>
            <span className="text-lg">{displayName}</span>
            <p className="text-sm font-normal text-gray-500">{user?.email}</p>
          </div>
        </div>
        
        <Link
          href="/profile"
          className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-colors duration-200 rounded-lg hover:bg-pink-50"
          onClick={onClose}
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Profile</span>
        </Link>

        <Link
          href="/wishlist"
          className="flex items-center justify-between gap-3 px-4 py-3 text-gray-700 transition-colors duration-200 rounded-lg hover:bg-pink-50"
          onClick={onClose}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.54 0-2.878.792-3.562 2.008C11.188 4.542 9.85 3.75 8.312 3.75 5.723 3.75 3.625 5.765 3.625 8.25c0 7.22 8.375 11.25 8.375 11.25s8.375-4.03 8.375-11.25z" />
            </svg>
            <span>Wishlist</span>
          </div>
          {wishlistCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-pink-500 rounded-full">
              {wishlistCount > 99 ? '99+' : wishlistCount}
            </span>
          )}
        </Link>
        
        <Link
          href="/myorders"
          className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-colors duration-200 rounded-lg hover:bg-pink-50"
          onClick={onClose}
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>My Orders</span>
        </Link>
        
        <button
          onClick={() => {
            logout();
            onClose?.();
          }}
          className="flex items-center w-full gap-3 px-4 py-3 text-left text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50"
        >
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    );
  }

  // Desktop dropdown
  return (
    <div className="relative items-center hidden md:flex" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 p-2 font-semibold text-gray-900 transition-all duration-200 rounded-lg hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-200"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="relative">
          <span className="flex items-center justify-center w-8 h-8 font-bold text-white uppercase rounded-full shadow-md bg-gradient-to-br from-pink-400 to-pink-600">
            {displayInitial}
          </span>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-white"></div>
        </div>
        <span className="hidden lg:block">{displayName}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {open && (
        <div className="absolute right-0 z-50 w-56 mt-2 overflow-hidden bg-white border border-gray-200 shadow-xl top-full rounded-xl">
          {/* Menu items */}
          <div className="py-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-colors duration-200 hover:bg-pink-50 hover:text-pink-600"
              onClick={() => setOpen(false)}
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </Link>

            <Link
              href="/wishlist"
              className="flex items-center justify-between gap-3 px-4 py-3 text-gray-700 transition-colors duration-200 hover:bg-pink-50 hover:text-pink-600"
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.54 0-2.878.792-3.562 2.008C11.188 4.542 9.85 3.75 8.312 3.75 5.723 3.75 3.625 5.765 3.625 8.25c0 7.22 8.375 11.25 8.375 11.25s8.375-4.03 8.375-11.25z" />
                </svg>
                <span>Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-pink-500 rounded-full">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>
            
            <Link
              href="/myorders"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-colors duration-200 hover:bg-pink-50 hover:text-pink-600"
              onClick={() => setOpen(false)}
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>My Orders</span>
            </Link>

            <div className="my-2 border-t border-gray-100"></div>
            
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="flex items-center w-full gap-3 px-4 py-3 text-left text-red-600 transition-colors duration-200 hover:bg-red-50"
            >
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}