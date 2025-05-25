
"use client";
import Link from "next/link";
import CategoriesDropdown from "./CategoriesDropdown";

export default function DesktopNav({ categories }) {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/blogs", label: "Blogs" },
  ];

  return (
    <div className="hidden md:flex gap-8 text-base font-medium">
      {navLinks.slice(0, 2).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="hover:text-pink-600 text-gray-900 transition"
        >
          {link.label}
        </Link>
      ))}
      
      <CategoriesDropdown categories={categories} />
      
      {navLinks.slice(2).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="hover:text-pink-600 text-gray-900 transition"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}