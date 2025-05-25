"use client";

import { CartProvider } from '../components/features/cart/CartContext';
import { ToasterProvider } from '../components/common/ToasterProvider/ToasterProvider';
import { Inter } from 'next/font/google';
import './globals.css';
import {Navbar,Footer} from '../components/layout'
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../context/AuthContext/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <body className={inter.className}>
       <AuthProvider>
         <CartProvider>
          <ToasterProvider />
          {!isAdmin && <Navbar />}
          <main>{children}</main>
          {!isAdmin && <Footer />}
        </CartProvider>
       </AuthProvider>
      </body>
    </html>
  );
}