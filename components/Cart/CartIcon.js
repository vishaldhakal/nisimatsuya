"use client";

import { useCart } from '@/components/Cart/CartContext';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart" className="relative">
      <ShoppingBag className="w-6 h-6 text-gray-700" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </Link>
  );
}