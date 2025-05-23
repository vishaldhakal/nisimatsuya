
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithGoogle } from '@/lib/authService';
import { useAuth } from '@/context/AuthContext';

export default function GoogleCallback() {
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
          const userData = await loginWithGoogle(code);
          setUser(userData);
          router.push('/');
        } else {
          throw new Error('Authorization code not found');
        }
      } catch (error) {
        console.error('Google authentication failed:', error);
        router.push('/login?error=google_auth_failed');
      }
    };

    handleGoogleCallback();
  }, [router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-yellow-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">Signing you in with Google...</h2>
        <p className="text-gray-600 mt-2">Please wait while we authenticate your account.</p>
      </div>
    </div>
  );
}