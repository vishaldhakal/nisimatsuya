"use client";

import { useCart } from './CartContext';
import Link from 'next/link';
export default function CartNotification() {
  const { showNotification, notificationMessage, totalItems } = useCart();

  if (!showNotification) return null;

  return (
    <div className="fixed z-50 bottom-4 right-4">
      <div className="flex items-center px-6 py-3 text-white bg-pink-600 rounded-lg shadow-lg">
        <span className="mr-2">{notificationMessage}</span>
        <span className="flex items-center justify-center w-6 h-6 text-sm font-bold text-pink-600 bg-white rounded-full">
          {totalItems}
        </span>
        <Link
          href="/cart" 
          className="px-3 py-1 ml-4 text-sm font-semibold text-pink-600 bg-white rounded hover:bg-gray-100"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}