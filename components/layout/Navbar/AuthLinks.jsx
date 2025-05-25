"use client";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { useState, useRef } from "react";

export default function AuthLinks() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  if (!isAuthenticated) {
    return (
      <div className="hidden md:flex items-center">
        <Link
          href="/login"
          className="text-pink-700 hover:text-pink-900 font-semibold"
        >
          Login
        </Link>
        <span className="text-gray-400">/</span>
        <Link
          href="/signup"
          className="text-pink-700 hover:text-pink-900 font-semibold"
        >
          signup
        </Link>
      </div>
    );
  }

  // Authenticated: show profile dropdown
  return (
    <div className="relative hidden md:flex items-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 font-semibold text-gray-900 hover:text-pink-600 focus:outline-none"
      >
        <span className="rounded-full bg-pink-100 w-8 h-8 flex items-center justify-center text-pink-600 font-bold uppercase">
          {user?.firstName?.[0] || user?.name?.[0] || "U"}
        </span>
        <span>{user?.firstName || user?.name || "Profile"}</span>
      </button>
      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50"
        >
          <Link
            href="/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-pink-50"
            onClick={() => setOpen(false)} 
          >
            Profile
          </Link>
          <button
            onClick={() => {
              logout(); 
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-pink-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}