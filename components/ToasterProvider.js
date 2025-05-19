"use client";

import { Toaster } from "react-hot-toast";

export const ToasterProvider = () => {
  return <Toaster 
    position="top-center"
    toastOptions={{
      style: {
        background: '#fff',
        color: '#000',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '16px',
        fontSize: '14px',
      },
      success: {
        iconTheme: {
          primary: '#ec4899',
          secondary: '#fff',
        },
      },
    }}
  />;
};