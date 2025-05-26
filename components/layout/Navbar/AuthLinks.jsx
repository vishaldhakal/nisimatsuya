"use client";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import UserDropdown from "./UserDropdown";

export default function AuthLinks() {
  const { isAuthenticated } = useAuth();

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

  // Use UserDropdown for authenticated users
  return <UserDropdown />;
}