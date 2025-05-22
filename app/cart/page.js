"use client";

import { useCart } from '../../components/Cart/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { cartItems, totalItems, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 text-center">
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="w-16 h-16 text-pink-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
              <Link 
                href="/products" 
                className="bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors duration-200 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                Shopping Cart <span className="ml-2 text-gray-500 font-normal">({totalItems} items)</span>
              </h2>
              <div>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center py-4 border-b last:border-b-0">
                    <div className="w-16 h-16 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">
                            {item.perUnit ? item.perUnit : ""}
                          </div>
                        </div>
                        <div className="font-semibold text-gray-900 whitespace-nowrap">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.name, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-gray-800 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.name, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.name)}
                          className="ml-4 text-pink-500 hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button 
                  onClick={clearCart}
                  className="text-gray-600 font-medium flex items-center hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-medium">₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Delivery</span>
                <span className="text-gray-900 font-medium">{totalAmount >= 499 ? 'Free' : '₹99'}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Tax (18% GST)</span>
                <span className="text-gray-900 font-medium">₹{(totalAmount * 0.18).toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{(totalAmount + (totalAmount >= 499 ? 0 : 99) + (totalAmount * 0.18)).toLocaleString()}
                </span>
              </div>
              <Link
                href="/checkout"
                className="w-full block text-center bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold py-3 rounded-lg transition-colors duration-200 mb-4"
              >
                Place Order
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}