"use client";

import { useCart } from '../../components/features/cart/CartContext';
import { useAuth } from '../../contexts/AuthContext/AuthContext'; 
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { Trash2, ArrowLeft, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useEffect } from 'react';

export default function CartPage() {
  const { cartItems, totalItems, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter(); 

  // Handle place order click
  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', '/cart');
      }
      router.push('/login?redirect=/cart');
    } else {
      router.push('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-4 bg-gray-50 xs:py-6 sm:py-12">
        <div className="max-w-2xl px-3 mx-auto xs:px-4 sm:px-6 lg:px-8">
          <div className="p-4 text-center bg-white shadow-sm rounded-xl xs:p-6 sm:p-8 lg:p-12">
            <div className="flex flex-col items-center justify-center py-6 xs:py-8 sm:py-12">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-pink-100 rounded-full xs:w-20 xs:h-20 sm:w-24 sm:h-24 xs:mb-5 sm:mb-6">
                <ShoppingBag className="w-8 h-8 text-pink-500 xs:w-10 xs:h-10 sm:w-12 sm:h-12" />
              </div>
              <h2 className="mb-3 text-lg font-bold text-gray-900 xs:text-xl xs:mb-4 sm:text-2xl lg:text-3xl">Your cart is empty</h2>
              <p className="mb-6 text-sm text-gray-600 xs:text-base xs:mb-7 sm:mb-8 lg:text-lg">Looks like you haven't added any products to your cart yet.</p>
              <Link 
                href="/products" 
                className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 rounded-lg xs:px-5 xs:py-3 xs:text-base bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2 xs:w-5 xs:h-5" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    console.log("Cart Items:", cartItems);
    cartItems.forEach((item, index) => {
      console.log(`Item ${index + 1}: Name - ${item.name}, Image - ${item.thumbnail_image}`);
    });
  }, [cartItems]);

  return (
    <div className="min-h-screen py-3 bg-gray-50 xs:py-4 sm:py-6 lg:py-12">
      <div className="px-3 mx-auto max-w-7xl xs:px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-4 xs:mb-6 sm:mb-8">
          <h1 className="text-xl font-bold text-gray-900 xs:text-2xl lg:text-3xl">Shopping Cart</h1>
          <p className="mt-1 text-sm text-gray-600 xs:mt-2 xs:text-base">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 xs:gap-6 sm:gap-8 lg:grid-cols-12">
          
          {/* Cart Items Section */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow-sm rounded-xl xs:rounded-2xl">
              {/* Cart Header */}
              <div className="px-3 py-3 border-b border-gray-200 xs:px-4 xs:py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900 xs:text-lg">Items in Cart</h2>
                  <button 
                    onClick={clearCart}
                    className="inline-flex items-center px-2 py-1.5 text-xs font-medium text-gray-600 transition-colors duration-200 border border-gray-300 rounded-md xs:px-3 xs:py-2 xs:text-sm xs:rounded-lg hover:text-red-600 hover:border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3 mr-1 xs:w-4 xs:h-4 xs:mr-2" />
                    <span className="hidden xs:inline">Clear Cart</span>
                    <span className="xs:hidden">Clear</span>
                  </button>
                </div>
              </div>
              
              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item, index) => (
                  <div key={item.id} className="p-3 xs:p-4 sm:p-6">
                    <div className="flex items-start space-x-3 xs:space-x-4 sm:space-x-6">
                      
                      {/* Product Image */}
                      <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100 rounded-lg xs:w-20 xs:h-20 xs:rounded-xl sm:w-24 sm:h-24 lg:w-28 lg:h-28">
                        <Image 
                          src={item.thumbnail_image ? `${process.env.NEXT_PUBLIC_API_URL}${item.thumbnail_image}` : '/images/ui/placeholder.png'}
                          alt={item.name} 
                          fill
                          className="object-contain p-1 xs:p-2"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-2 xs:pr-3 sm:pr-4">
                            <h3 className="text-sm font-semibold leading-tight text-gray-900 xs:text-base sm:text-lg">
                              {item.name}
                            </h3>
                            {item.perUnit && (
                              <p className="mt-1 text-xs text-gray-500 xs:text-sm">
                                {item.perUnit}
                              </p>
                            )}
                            
                            {/* Mobile Price Display */}
                            <div className="mt-2 sm:hidden">
                              <div className="text-xs text-gray-500 xs:text-sm">
                                ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                              </div>
                              <div className="text-base font-bold text-pink-600 xs:text-lg">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>
                          
                          {/* Desktop Price Display */}
                          <div className="hidden text-right sm:block lg:block">
                            <div className="mb-1 text-sm text-gray-500">
                              ₹{item.price.toLocaleString('en-IN')} each
                            </div>
                            <div className="text-lg font-bold text-gray-900 sm:text-xl">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                        
                        {/* Quantity Controls and Actions */}
                        <div className="flex items-center justify-between mt-3 xs:mt-4 sm:justify-start sm:space-x-4 lg:space-x-6">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-md xs:rounded-lg bg-gray-50">
                            <button
                              onClick={() => updateQuantity(item.id, item.name, item.quantity - 1)}
                              className="flex items-center justify-center w-8 h-8 text-gray-600 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-800 rounded-l-md xs:w-9 xs:h-9 xs:rounded-l-lg sm:w-10 sm:h-10"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3 xs:w-4 xs:h-4" />
                            </button>
                            <span className="flex items-center justify-center w-10 h-8 text-sm font-semibold text-gray-800 bg-white border-gray-300 border-x xs:w-12 xs:h-9 xs:text-base sm:h-10">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.name, item.quantity + 1)}
                              className="flex items-center justify-center w-8 h-8 text-gray-600 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-800 rounded-r-md xs:w-9 xs:h-9 xs:rounded-r-lg sm:w-10 sm:h-10"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3 xs:w-4 xs:h-4" />
                            </button>
                          </div>
                          
                          {/* Remove Button */}
                          <button 
                            onClick={() => removeFromCart(item.id, item.name)}
                            className="inline-flex items-center px-2 py-1.5 text-xs font-medium text-red-600 transition-colors duration-200 hover:text-red-700 hover:bg-red-50 rounded-md xs:px-3 xs:py-2 xs:text-sm xs:rounded-lg"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 className="w-3 h-3 mr-1 xs:w-4 xs:h-4 xs:mr-2" />
                            <span className="hidden xs:inline">Remove</span>
                            <span className="xs:hidden">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-3 xs:top-4 sm:top-6">
              <div className="p-4 bg-white shadow-sm rounded-xl xs:p-5 xs:rounded-2xl sm:p-6">
                <h2 className="mb-4 text-lg font-bold text-gray-900 xs:text-xl xs:mb-5 sm:mb-6">Order Summary</h2>
                
                {/* Summary Details */}
                <div className="mb-5 space-y-3 xs:space-y-4 xs:mb-6 sm:mb-6">
                  <div className="flex justify-between items-center py-1.5 xs:py-2">
                    <span className="text-sm text-gray-600 xs:text-base">Subtotal ({totalItems} items)</span>
                    <span className="text-sm font-semibold text-gray-900 xs:text-base">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1.5 xs:py-2">
                    <span className="text-sm text-gray-600 xs:text-base">Delivery Fee</span>
                    <span className="text-sm font-semibold xs:text-base">
                      {totalAmount >= 499 ? (
                        <span className="font-bold text-green-600">FREE</span>
                      ) : (
                        <span className="text-gray-900">₹99</span>
                      )}
                    </span>
                  </div>
                  
                  {totalAmount < 499 && (
                    <div className="p-3 border border-blue-200 rounded-lg bg-blue-50 xs:p-4">
                      <div className="flex items-start xs:items-center">
                        <div className="flex-shrink-0 mt-0.5 xs:mt-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <p className="ml-3 text-xs leading-tight text-blue-700 xs:text-sm xs:leading-normal">
                          Add <span className="font-semibold">₹{(499 - totalAmount).toLocaleString('en-IN')}</span> more for free delivery
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-gray-200 xs:pt-4">
                  <div className="flex items-center justify-between mb-4 xs:mb-5 sm:mb-6">
                    <span className="text-lg font-bold text-gray-900 xs:text-xl">Total</span>
                    <span className="text-lg font-bold text-gray-900 xs:text-xl sm:text-2xl">
                      ₹{(totalAmount + (totalAmount < 499 ? 99 : 0)).toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-2.5 xs:space-y-3">
                    <button
                      onClick={handlePlaceOrder}
                      className="w-full py-3 text-sm font-semibold text-white transition-all duration-200 rounded-lg xs:py-3.5 xs:text-base xs:rounded-xl sm:py-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 hover:scale-[1.02] shadow-lg hover:shadow-xl active:scale-95"
                    >
                      Place Order
                    </button>
                    
                    <Link 
                      href="/products" 
                      className="block w-full py-2.5 text-sm font-medium text-center text-gray-700 transition-all duration-200 border-2 border-gray-300 rounded-lg xs:py-3 xs:text-base xs:rounded-xl hover:bg-gray-50 hover:border-gray-400"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="pt-3 mt-4 border-t border-gray-200 xs:mt-5 xs:pt-4 sm:mt-6 sm:pt-4">
                  <div className="flex items-center justify-center text-xs text-gray-500 xs:text-sm">
                    <svg className="w-3 h-3 mr-2 text-green-500 xs:w-4 xs:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Secure Checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}