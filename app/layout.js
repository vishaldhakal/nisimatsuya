"use client";

import { CartProvider } from '../components/features/cart/CartContext';
import { ToasterProvider } from '../components/common/ToasterProvider/ToasterProvider';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar, Footer } from '../components/layout';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../context/AuthContext/AuthContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  
  // Create QueryClient instance
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            
              <CartProvider>
                <ToasterProvider />
                {!isAdmin && <Navbar />}
                <main>{children}</main>
                {!isAdmin && <Footer />}
              </CartProvider>
            
          </AuthProvider>
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        </QueryClientProvider>
      </body>
    </html>
  );
}