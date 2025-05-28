"use client";

import { useEffect, useState } from 'react';
import { useJWTSession } from '../../hooks/useJWTSession';
import { useCart } from '../../components/features/cart/CartContext';
import { useRouter } from 'next/navigation';
import { User, ShoppingBag, Mail, Phone, MapPin, Edit } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// JWT Decode function
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

const ProfileHeader = ({ userInfo, onEdit }) => (
  <div className="p-3 mb-4 bg-white rounded-lg shadow-sm sm:rounded-2xl xs:p-4 sm:p-6 sm:mb-6">
    <div className="flex flex-col items-start justify-between gap-3 xs:flex-row xs:items-center xs:gap-4">
      <div className="flex items-center w-full space-x-3 xs:space-x-4 xs:w-auto">
        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-purple-600">
          <User className="w-6 h-6 text-white xs:w-7 xs:h-7 sm:w-8 sm:h-8" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 truncate xs:text-xl sm:text-2xl">
            {`${userInfo?.first_name || ''} ${userInfo?.last_name || ''}`.trim() || 'User'}
          </h1>
          <p className="text-sm text-gray-600 truncate xs:text-base">{userInfo?.email}</p>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="flex items-center justify-center flex-shrink-0 w-full px-3 py-2 space-x-2 text-sm transition-colors bg-gray-100 rounded-lg xs:px-4 hover:bg-gray-200 xs:w-auto xs:text-base"
      >
        <Edit className="w-3 h-3 xs:w-4 xs:h-4" />
        <span>Edit Profile</span>
      </button>
    </div>
  </div>
);

const UserDetails = ({ userInfo }) => (
  <div className="p-3 mb-4 bg-white rounded-lg shadow-sm sm:rounded-2xl xs:p-4 sm:p-6 sm:mb-6">
    <h2 className="mb-3 text-base font-semibold text-gray-900 xs:text-lg xs:mb-4">Personal Information</h2>
    <div className="space-y-3 xs:space-y-4">
      <div className="flex items-start space-x-3 xs:items-center">
        <Mail className="flex-shrink-0 w-4 h-4 mt-1 text-gray-400 xs:w-5 xs:h-5 xs:mt-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 xs:text-sm">Email</p>  
          <p className="text-sm text-gray-900 break-all xs:text-base">{userInfo?.email || 'Not provided'}</p>
        </div>
      </div>
      <div className="flex items-start space-x-3 xs:items-center">
        <Phone className="flex-shrink-0 w-4 h-4 mt-1 text-gray-400 xs:w-5 xs:h-5 xs:mt-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 xs:text-sm">Phone</p>
          <p className="text-sm text-gray-900 break-all xs:text-base">{userInfo?.phone || 'Not provided'}</p>
        </div>
      </div>
      <div className="flex items-start space-x-3 xs:items-center">
        <MapPin className="flex-shrink-0 w-4 h-4 mt-1 text-gray-400 xs:w-5 xs:h-5 xs:mt-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 xs:text-sm">Address</p>
          <p className="text-sm text-gray-900 break-words xs:text-base">{userInfo?.address || 'Not provided'}</p>
        </div>
      </div>
    </div>
  </div>
);

const CartSummary = ({ cartItems, totalItems, totalAmount }) => {
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="p-3 bg-white rounded-lg shadow-sm sm:rounded-2xl xs:p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 xs:mb-4">
          <h2 className="text-base font-semibold text-gray-900 xs:text-lg">Shopping Cart</h2>
          <ShoppingBag className="w-4 h-4 text-gray-400 xs:w-5 xs:h-5" />
        </div>
        <div className="py-6 text-center xs:py-8">
          <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-gray-300 xs:w-12 xs:h-12 xs:mb-3" />
          <p className="text-sm text-gray-500 xs:text-base">Your cart is empty</p>
          <Link 
            href="/products" 
            className="inline-block mt-2 text-sm font-medium text-pink-600 xs:mt-3 hover:text-pink-700 xs:text-base"
          >
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-white rounded-lg shadow-sm sm:rounded-2xl xs:p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 xs:mb-4">
        <h2 className="text-base font-semibold text-gray-900 xs:text-lg">Shopping Cart</h2>
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-4 h-4 text-pink-600 xs:w-5 xs:h-5" />
          <span className="text-xs font-medium text-pink-600 xs:text-sm">{totalItems} items</span>
        </div>
      </div>
      
      <div className="mb-3 space-y-2 overflow-y-auto xs:space-y-3 xs:mb-4 max-h-48 xs:max-h-64">
        {cartItems.slice(0, 5).map((item) => (
          <div key={`${item.id}_${item.name}`} className="flex items-center p-2 space-x-2 rounded-lg xs:space-x-3 xs:p-3 bg-gray-50">
            <div className="relative flex-shrink-0 w-10 h-10 overflow-hidden bg-white rounded-lg xs:w-12 xs:h-12">
              <Image 
                src= {item.thumbnail_image ? `${process.env.NEXT_PUBLIC_API_URL}${item.thumbnail_image}` : '/images/ui/placeholder.png'}
                alt={item.name} 
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate xs:text-sm">{item.name}</p>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div className="flex-shrink-0 text-xs font-semibold text-gray-900 xs:text-sm">
              ₹{(item.price * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
        {cartItems.length > 5 && (
          <div className="py-2 text-center">
            <span className="text-xs text-gray-500 xs:text-sm">
              +{cartItems.length - 5} more items
            </span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-gray-200 xs:pt-4">
        <div className="flex items-center justify-between mb-2 xs:mb-3">
          <span className="text-sm text-gray-600 xs:text-base">Subtotal</span>
          <span className="text-sm font-semibold text-gray-900 xs:text-base">₹{totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between mb-3 xs:mb-4">
          <span className="text-sm text-gray-600 xs:text-base">Total Items</span>
          <span className="text-sm font-semibold text-gray-900 xs:text-base">{totalItems}</span>
        </div>
        <div className="flex flex-col space-y-2 xs:flex-row xs:space-y-0 xs:space-x-3">
          <Link
            href="/cart"
            className="flex-1 py-2 text-sm text-center text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 xs:text-base"
          >
            View Cart
          </Link>
          <Link
            href="/checkout"
            className="flex-1 py-2 text-sm text-center text-white transition-opacity rounded-lg bg-gradient-to-r from-pink-600 to-pink-500 hover:opacity-90 xs:text-base"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const { session, logout, isLoading } = useJWTSession();
  const { cartItems, totalItems, totalAmount } = useCart();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/login');
    }
  }, [session, isLoading, router]);

  useEffect(() => {
    if (session && typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token') || session.accessToken;
      if (token) {
        const decodedToken = decodeJWT(token);
        if (decodedToken) {
          setUserInfo({
            email: decodedToken.email,
            first_name: decodedToken.first_name,
            last_name: decodedToken.last_name,
            phone: decodedToken.phone,
            address: decodedToken.address,
            user_id: decodedToken.user_id
          });
        }
      }
    }
  }, [session]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-3 border-b-2 border-pink-600 rounded-full animate-spin xs:h-12 xs:w-12 xs:mb-4"></div>
          <p className="text-sm text-gray-600 xs:text-base">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; 
  }

  return (
    <div className="min-h-screen py-4 bg-gray-50 xs:py-6 sm:py-8">
      <div className="max-w-6xl px-3 mx-auto xs:px-4 sm:px-6 lg:px-8">
        <ProfileHeader userInfo={userInfo} onEdit={handleEdit} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xs:gap-6">
          <div className="space-y-4 lg:col-span-2 xs:space-y-6">
            <UserDetails userInfo={userInfo} />
            <div className="p-3 bg-white rounded-lg shadow-sm sm:rounded-2xl xs:p-4 sm:p-6">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 xs:text-base"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="space-y-4 xs:space-y-6">
            <CartSummary 
              cartItems={cartItems} 
              totalItems={totalItems} 
              totalAmount={totalAmount} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}