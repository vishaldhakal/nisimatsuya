"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage when component mounts
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


  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
    
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
      
        return [...prevItems, { ...product, quantity }];
      }
    });
  };


  const updateQuantity = (productId, quantity) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.max(1, quantity) } 
          : item
      )
    );
  };


  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
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
    isInitialized
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