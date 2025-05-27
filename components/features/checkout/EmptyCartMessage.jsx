import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EmptyCartMessage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-16 h-16 text-pink-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to your cart before proceeding to checkout.</p>
            <Link href="/products" className="bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors duration-200 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}