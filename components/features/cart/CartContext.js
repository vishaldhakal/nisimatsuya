"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
      } catch (e) {
        setCartItems([]);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const amount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTotalItems(itemCount);
    setTotalAmount(amount);
  }, [cartItems, isInitialized]);

  // Create a unique key for each product
  const createProductKey = (product) => {
    // Using name as part of the key to differentiate products with same ID but from different components
    return `${product.id}_${product.name}`;
  };

  const addToCart = (product, quantity = 1) => {
    const productKey = createProductKey(product);
    
    setCartItems(prevItems => {
      // Find existing item using the combined key
      const existingItem = prevItems.find(item => createProductKey(item) === productKey);
      
      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map(item => 
          createProductKey(item) === productKey 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { ...product, quantity }];
      }
    });

    // Show notification
    setNotificationMessage(`${quantity} ${product.name} added to cart`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const updateQuantity = (productId, productName, quantity) => {
    const productKey = `${productId}_${productName}`;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        createProductKey(item) === productKey
          ? { ...item, quantity: Math.max(1, quantity) } 
          : item
      )
    );
  };

  const removeFromCart = (productId, productName) => {
    const productKey = `${productId}_${productName}`;
    
    setCartItems(prevItems => 
      prevItems.filter(item => createProductKey(item) !== productKey)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const value = {
    cartItems,
    totalItems,
    totalAmount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInitialized,
    showNotification,
    notificationMessage
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}