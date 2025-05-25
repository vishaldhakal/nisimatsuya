
"use client";
import Image from "next/image";
import Link from "next/link";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import CartIcon from "./CartIcon";
import AuthLinks from "./AuthLinks";
import { useCategories } from "../../../hooks/useCategories";
import { useMobileMenu } from "../../../hooks/useMobileMenu";
import { MenuIcon, XIcon } from "lucide-react";

export default function Navbar() {
  const { filteredCategories } = useCategories();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu();

  return (
    <nav className="bg-white shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src="/images/ui/logo.svg"
              alt="Nishimatsuya Logo"
              width={100}
              height={100}
              className="rounded-full"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <DesktopNav categories={filteredCategories} />

        {/* Right Section */}
        <div className="flex gap-4 items-center">
          <AuthLinks />
          <CartIcon />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden ml-2 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <XIcon className="h-6 w-6 text-gray-700" />
            ) : (
              <MenuIcon className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        categories={filteredCategories}
      />
    </nav>
  );
}