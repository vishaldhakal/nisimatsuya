import Link from "next/link";
import { useState, useRef } from "react";
import { useAuth } from "../../../context/AuthContext/AuthContext";

export default function UserDropdown({ isMobile = false, onClose }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayName = user?.firstName || user?.name || "Profile";
  const displayInitial = user?.firstName?.[0] || user?.name?.[0] || "U";

  if (isMobile) {
    // Always open in mobile menu
    return (
      <div className="flex flex-col space-y-2 p-4 border-t">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <span className="rounded-full bg-pink-100 w-8 h-8 flex items-center justify-center text-pink-600 font-bold uppercase">
            {displayInitial}
          </span>
          <span>{displayName}</span>
        </div>
        <Link
          href="/profile"
          className="block px-4 py-2 text-gray-700 hover:bg-pink-50"
          onClick={onClose}
        >
          Profile
        </Link>
        <button
          onClick={() => {
            logout();
            onClose?.();
          }}
          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-pink-50"
        >
          Logout
        </button>
      </div>
    );
  }

  // Desktop dropdown
  return (
    <div className="relative hidden md:flex items-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 font-semibold text-gray-900 hover:text-pink-600 focus:outline-none"
      >
        <span className="rounded-full bg-pink-100 w-8 h-8 flex items-center justify-center text-pink-600 font-bold uppercase">
          {displayInitial}
        </span>
        <span>{displayName}</span>
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