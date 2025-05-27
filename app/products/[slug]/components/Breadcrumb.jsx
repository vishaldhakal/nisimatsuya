import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export const Breadcrumb = ({ product }) => (
  <nav className="mb-8">
    <ol className="flex items-center space-x-2 text-sm">
      <li>
        <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700">
          <Home className="w-4 h-4" />
        </Link>
      </li>
      <li><ChevronRight className="w-4 h-4 text-gray-400" /></li>
      <li>
        <Link href="/products" className="text-gray-500 hover:text-gray-700">
          Products
        </Link>
      </li>
      <li><ChevronRight className="w-4 h-4 text-gray-400" /></li>
      <li className="font-medium text-gray-900 truncate">{product.name}</li>
    </ol>
  </nav>
);