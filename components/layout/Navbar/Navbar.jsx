
"use client";
import Image from "next/image";
import Link from "next/link";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import CartIcon from "./CartIcon";
import AuthLinks from "./AuthLinks";
import { useCategories } from "../../../contexts/CategoriesContext";
import { useMobileMenu } from "../../../hooks/useMobileMenu";
import { MenuIcon, XIcon } from "lucide-react";

export default function Navbar() {
  const { filteredCategories } = useCategories();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu();

  return (
    <nav className="relative z-20 bg-white shadow-sm">
      <div className="flex items-center justify-between h-20 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
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
        <div className="flex items-center gap-4">
          <AuthLinks />
          <CartIcon />

          {/* Mobile Menu Button */}
          <button
            className="p-1 ml-2 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-pink-500"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <XIcon className="w-6 h-6 text-gray-700" />
            ) : (
              <MenuIcon className="w-6 h-6 text-gray-700" />
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