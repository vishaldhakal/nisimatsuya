"use client";

import { CartProvider } from '../components/Cart/CartContext';
import { ToasterProvider } from '../components/ToasterProvider';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <ToasterProvider />
          {!isAdmin && <Navbar />}
          <main>{children}</main>
          {!isAdmin && <Footer />}
        </CartProvider>
      </body>
    </html>
  );
}