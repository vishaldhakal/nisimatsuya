"use client";

import { useCart } from '../../components/features/cart/CartContext';
import { useAuth } from '../../context/AuthContext/AuthContext'; 
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
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
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="max-w-2xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="p-6 text-center bg-white shadow-sm rounded-2xl lg:p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="w-16 h-16 mb-4 text-pink-400" />
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Your cart is empty</h2>
              <p className="mb-6 text-gray-600">Looks like you haven't added any products to your cart yet.</p>
              <Link 
                href="/products" 
                className="flex items-center px-6 py-3 font-semibold text-white transition-colors duration-200 rounded-lg bg-gradient-to-r from-pink-600 to-pink-500 hover:bg-pink-700"
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

  useEffect(() => {
    console.log("Cart Items:", cartItems);
    cartItems.forEach((item, index) => {
      console.log(`Item ${index + 1}: Name - ${item.name}, Image - ${item.thumbnail_image}`);
    });
  }, [cartItems]);

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-5xl px-2 mx-auto sm:px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="p-6 bg-white shadow rounded-xl">
              <h2 className="flex items-center mb-4 text-xl font-bold text-gray-900">
                Shopping Cart <span className="ml-2 font-normal text-gray-500">({totalItems} items)</span>
              </h2>
              <div>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center py-4 border-b last:border-b-0">
                    <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100 rounded-lg">
                      <Image 
                        src={item.thumbnail_image ? `${process.env.NEXT_PUBLIC_API_URL}${item.thumbnail_image}` : '/images/ui/placeholder.png'}
                        alt={item.name} 
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="flex items-center justify-between">
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
                          <span className="px-3 py-1 font-semibold text-gray-800">{item.quantity}</span>
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
                  className="flex items-center font-medium text-gray-600 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="p-6 bg-white shadow rounded-xl">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium text-gray-900">{totalAmount >= 499 ? 'Free' : '₹99'}</span>
              </div>
              <div className="flex justify-between mb-4">
                {/* <span className="text-gray-600">Tax (18% GST)</span>
                <span className="font-medium text-gray-900">₹{(totalAmount * 0.18).toLocaleString()}</span> */}
              </div>
              <div className="my-4 border-t border-gray-200"></div>
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{(totalAmount).toLocaleString()}
                </span>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                className="block w-full py-3 mb-4 font-semibold text-center text-white transition-colors duration-200 rounded-lg bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600"
              >
                Place Order
              </button>
              
              
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}