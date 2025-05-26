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
  <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {`${userInfo?.first_name || ''} ${userInfo?.last_name || ''}`.trim() || 'User'}
          </h1>
          <p className="text-gray-600">{userInfo?.email}</p>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <Edit className="w-4 h-4" />
        <span>Edit Profile</span>
      </button>
    </div>
  </div>
);

const UserDetails = ({ userInfo }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Mail className="w-5 h-5 text-gray-400" />
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-gray-900">{userInfo?.email || 'Not provided'}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Phone className="w-5 h-5 text-gray-400" />
        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="text-gray-900">{userInfo?.phone || 'Not provided'}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <MapPin className="w-5 h-5 text-gray-400" />
        <div>
          <p className="text-sm text-gray-500">Address</p>
          <p className="text-gray-900">{userInfo?.address || 'Not provided'}</p>
        </div>
      </div>
    </div>
  </div>
);

const CartSummary = ({ cartItems, totalItems, totalAmount }) => {
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
          <ShoppingBag className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-center py-8">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Your cart is empty</p>
          <Link 
            href="/products" 
            className="inline-block mt-3 text-pink-600 hover:text-pink-700 font-medium"
          >
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-5 h-5 text-pink-600" />
          <span className="text-sm font-medium text-pink-600">{totalItems} items</span>
        </div>
      </div>
      
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {cartItems.slice(0, 5).map((item) => (
          <div key={`${item.id}_${item.name}`} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 relative flex-shrink-0 rounded-lg overflow-hidden bg-white">
              <Image 
                src= {item.thumbnail_image ? `${process.env.NEXT_PUBLIC_API_URL}${item.thumbnail_image}` : '/images/ui/placeholder.png'}
                alt={item.name} 
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div className="text-sm font-semibold text-gray-900">
              ₹{(item.price * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
        {cartItems.length > 5 && (
          <div className="text-center py-2">
            <span className="text-sm text-gray-500">
              +{cartItems.length - 5} more items
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-gray-900">₹{totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Total Items</span>
          <span className="font-semibold text-gray-900">{totalItems}</span>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/cart"
            className="flex-1 bg-gray-100 text-gray-700 text-center py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            View Cart
          </Link>
          <Link
            href="/checkout"
            className="flex-1 bg-gradient-to-r from-pink-600 to-pink-500 text-white text-center py-2 rounded-lg hover:opacity-90 transition-opacity"
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileHeader userInfo={userInfo} onEdit={handleEdit} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UserDetails userInfo={userInfo} />
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="space-y-6">
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