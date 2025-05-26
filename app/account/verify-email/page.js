
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import Link from 'next/link';

function VerifyEmailContent() {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail, resendVerificationEmail } = useAuth();

  useEffect(() => {
    const verifyEmailToken = async () => {
      // Get the token from URL - it could be in different formats
      const token = searchParams.get('token') || searchParams.get('key');
      
      // Also check if the token is in the URL path (encoded)
      const urlPath = window.location.pathname;
      const pathToken = urlPath.split('/').pop();
      
      const emailToken = token || decodeURIComponent(pathToken);

      if (!emailToken) {
        setStatus('error');
        setMessage('Invalid verification link. Please check your email and try again.');
        return;
      }

      try {
        const response = await verifyEmail(emailToken);
        
        setStatus('success');
        setMessage('Your email has been verified successfully! You are now logged in.');
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
        
      } catch (error) {
        setStatus('error');
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            'Email verification failed. The link may be expired or invalid.';
        setMessage(errorMessage);
        
        // Try to extract email from error or URL for resend option
        const email = error.response?.data?.email || searchParams.get('email');
        if (email) {
          setResendEmail(email);
        }
      }
    };

    verifyEmailToken();
  }, [searchParams, verifyEmail, router]);

  const handleResendVerification = async () => {
    if (!resendEmail) {
      setMessage('Please provide your email address to resend verification.');
      return;
    }

    try {
      await resendVerificationEmail(resendEmail);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          'Failed to resend verification email. Please try again.';
      setMessage(errorMessage);
    }
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verifying Your Email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email Verified!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {message}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Redirecting you to the homepage in a few seconds...
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verification Failed
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {message}
          </p>
          
          {resendEmail && (
            <div className="mt-6">
              <button
                onClick={handleResendVerification}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Resend Verification Email
              </button>
            </div>
          )}
          
          <div className="mt-6 space-y-2">
            <Link
              href="/signup"
              className="block font-medium text-indigo-600 hover:text-indigo-500"
            >
              Try signing up again
            </Link>
            <Link
              href="/login"
              className="block font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}