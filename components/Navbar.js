"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);

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

  const categories = [
    { name: "Baby Clothing", href: "/category/clothing" },
    { name: "Baby Toys", href: "/category/toys" },
    { name: "Baby Care", href: "/category/care" },
    { name: "Baby Food", href: "/category/food" },
    { name: "Baby Furniture", href: "/category/furniture" },
    { name: "Baby Accessories", href: "/category/accessories" },
  ];

  return (
    <nav className="bg-white shadow-sm">
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
        <div className="hidden md:flex gap-8 text-base font-medium">
          <Link
            href="/"
            className="hover:text-pink-600 text-gray-900 transition"
          >
            Home
          </Link>
          <div
            className="relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
        </div>
        <div className="flex gap-4 items-center">
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
          <Link href="/cart" className="ml-4 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-pink-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437m0 0l1.7 6.385a2.25 2.25 0 002.183 1.692h7.299a2.25 2.25 0 002.183-1.692l1.7-6.385m-13.165 0h13.165"
              />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
