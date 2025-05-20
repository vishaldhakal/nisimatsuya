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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <div className="text-lg font-medium text-gray-600">
            Total Items: <span className="text-pink-600 font-bold">{totalItems}</span>
          </div>
        </div>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6 lg:mb-0">
              <div className="p-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row py-6 border-b border-gray-200 last:border-0">
                    <div className="flex-shrink-0 sm:mr-6 mb-4 sm:mb-0">
                      <div className="w-full sm:w-24 h-24 relative">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill
                          className="object-contain" 
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link href={`/products/${item.id}`} className="hover:text-pink-500">
                              {item.name}
                            </Link>
                          </h3>
                          <div className="mt-1 flex items-center">
                            <span className="text-sm text-gray-400 line-through mr-2">
                              ₹{item.mrp.toLocaleString()}
                            </span>
                            <span className="text-base text-black font-bold">
                              ₹{item.price.toLocaleString()}
                            </span>
                            {item.perUnit && (
                              <span className="text-xs text-gray-400 ml-1">
                                ({item.perUnit})
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-4 sm:mt-0">
                          <div className="flex items-center border border-gray-300 rounded-lg mr-4">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm font-medium text-gray-900">
                        Subtotal: ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <Link 
                  href="/products" 
                  className="text-pink-600 font-medium flex items-center hover:text-pink-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
                
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
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({totalItems})</span>
                    <span className="text-gray-900 font-medium">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900 font-medium">
                      {totalAmount >= 499 ? 'Free' : '₹99'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18% GST)</span>
                    <span className="text-gray-900 font-medium">₹{(totalAmount * 0.18).toLocaleString()}</span>
                  </div>
                  
                  <div className="h-px bg-gray-200 my-4"></div>
                  
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{(totalAmount + (totalAmount >= 499 ? 0 : 99) + (totalAmount * 0.18)).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <Link
                  href="/checkout"
                  className="w-full mt-6 flex justify-center bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold py-3 rounded-lg hover:bg-pink-700 transition-colors duration-200"
                >
                  Proceed to Checkout
                </Link>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>Safe & Secure Payments</p>
                  <p>100% Authentic Products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}