"use client";

import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';

const FlyingCartAnimation = ({ 
  isActive, 
  startPosition, 
  targetPosition, 
  onComplete,
  productImage 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('initial'); // initial, flying, shrinking

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      setAnimationPhase('initial');
      
      // Start flying animation immediately
      const flyTimer = setTimeout(() => {
        setAnimationPhase('flying');
      }, 50);

      // Start shrinking animation
      const shrinkTimer = setTimeout(() => {
        setAnimationPhase('shrinking');
      }, 600); // Reduced from 800ms

      // Complete animation
      const completeTimer = setTimeout(() => {
        setIsVisible(false);
        setAnimationPhase('initial');
        onComplete?.();
      }, 900); // Reduced from 1200ms

      return () => {
        clearTimeout(flyTimer);
        clearTimeout(shrinkTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isActive, onComplete]);

  if (!isVisible || !startPosition || !targetPosition) return null;

  const deltaX = targetPosition.x - startPosition.x;
  const deltaY = targetPosition.y - startPosition.y;

  // Calculate transform based on animation phase
  const getTransform = () => {
    switch (animationPhase) {
      case 'initial':
        return 'translate(0, 0) scale(1)';
      case 'flying':
        return `translate(${deltaX}px, ${deltaY}px) scale(0.5)`;
      case 'shrinking':
        return `translate(${deltaX}px, ${deltaY}px) scale(0)`;
      default:
        return 'translate(0, 0) scale(1)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Flying product image */}
      <div
        className="absolute transition-all duration-500 ease-out"
        style={{
          left: startPosition.x - 25,
          top: startPosition.y - 25,
          transform: getTransform(),
          opacity: animationPhase === 'shrinking' ? 0 : 1,
        }}
      >
        {productImage ? (
          <div className="w-12 h-12 overflow-hidden bg-white border-2 border-pink-200 rounded-lg shadow-lg">
            <img 
              src={productImage} 
              alt="Flying product" 
              className="object-contain w-full h-full"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-pink-600">
            <ShoppingCart size={20} className="text-white" />
          </div>
        )}
      </div>

      {/* Success ripple effect at start position */}
      <div
        className={`absolute w-16 h-16 rounded-full border-2 border-green-400 ${
          animationPhase === 'initial' ? 'animate-ping' : 'opacity-0'
        }`}
        style={{
          left: startPosition.x - 32,
          top: startPosition.y - 32,
        }}
      />

      {/* Target cart highlight */}
      <div
        className={`absolute w-8 h-8 rounded-full bg-pink-500 ${
          animationPhase === 'shrinking' ? 'animate-pulse scale-150' : 'opacity-0'
        } transition-all duration-300`}
        style={{
          left: targetPosition.x - 16,
          top: targetPosition.y - 16,
        }}
      />
    </div>
  );
};

export default FlyingCartAnimation;