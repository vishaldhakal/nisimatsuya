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
        <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-pink-500 rounded-full -top-2 -right-2">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </Link>
  );
}