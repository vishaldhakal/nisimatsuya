"use client";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext/AuthContext";
import UserDropdown from "./UserDropdown";

export default function AuthLinks() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="items-center hidden md:flex">
        <Link
          href="/login"
          className="font-semibold text-pink-700 hover:text-pink-900"
        >
          Login
        </Link>
        <span className="text-gray-400">/</span>
        <Link
          href="/signup"
          className="font-semibold text-pink-700 hover:text-pink-900"
        >
          signup
        </Link>
      </div>
    );
  }
  return <UserDropdown />;
}