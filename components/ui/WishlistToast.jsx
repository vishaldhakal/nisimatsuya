
"use client";

import React, { useState, useEffect } from 'react';
import { Heart, X, CheckCircle } from 'lucide-react';

const WishlistToast = ({ 
  message, 
  type = 'success', // 'success', 'error', 'info'
  duration = 3000,
  onClose,
  show = false
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!isVisible || !message) return null;

  const typeStyles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="w-4 h-4 text-green-500" />
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <X className="w-4 h-4 text-red-500" />
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: <Heart className="w-4 h-4 text-blue-500" />
    }
  };

  const currentStyle = typeStyles[type];

  return (
    <div className="fixed z-50 top-4 right-4 animate-fade-in">
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
        ${currentStyle.bg} ${currentStyle.text}
        transform transition-all duration-300 ease-in-out
      `}>
        {currentStyle.icon}
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
          className="p-1 ml-2 transition-colors rounded-full hover:bg-black hover:bg-opacity-10"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default WishlistToast;