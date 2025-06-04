
"use client";

import React, { createContext, useContext, useState } from 'react';
import WishlistToast from '../components/ui/WishlistToast';

const WishlistNotificationContext = createContext();

export const useWishlistNotification = () => {
  const context = useContext(WishlistNotificationContext);
  if (!context) {
    throw new Error('useWishlistNotification must be used within WishlistNotificationProvider');
  }
  return context;
};

export const WishlistNotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  return (
    <WishlistNotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <WishlistToast
        message={notification.message}
        type={notification.type}
        show={notification.show}
        onClose={hideNotification}
      />
    </WishlistNotificationContext.Provider>
  );
};