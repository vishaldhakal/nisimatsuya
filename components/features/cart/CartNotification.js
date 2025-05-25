"use client";

import { useCart } from './CartContext';

export default function CartNotification() {
  const { showNotification, notificationMessage, totalItems } = useCart();

  if (!showNotification) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-pink-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
        <span className="mr-2">{notificationMessage}</span>
        <span className="bg-white text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          {totalItems}
        </span>
        <a 
          href="/cart" 
          className="ml-4 px-3 py-1 bg-white text-pink-600 rounded text-sm font-semibold hover:bg-gray-100"
        >
          Checkout
        </a>
      </div>
    </div>
  );
}