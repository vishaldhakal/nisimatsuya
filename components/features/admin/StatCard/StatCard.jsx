"use client";

import { 
  Package, 
  ShoppingCart, 
  Clock, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  TrendingDown
} from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  icon, 
  iconColor, 
  trend, 
  trendDirection,
  isCurrency = false,
  isLoading = false 
}) {
  // Format currency if needed
  const formattedValue = isCurrency 
    ? new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      }).format(value || 0)
    : (value || 0).toLocaleString();

  // Get the appropriate icon component
  const IconComponent = () => {
    const iconProps = "w-6 h-6";
    
    switch(icon) {
      case 'Package':
        return <Package className={`${iconProps} text-blue-500`} />;
      case 'ShoppingCart':
        return <ShoppingCart className={`${iconProps} text-purple-500`} />;
      case 'Clock':
        return <Clock className={`${iconProps} text-yellow-500`} />;
      case 'DollarSign':
        return <DollarSign className={`${iconProps} text-green-500`} />;
      default:
        return <Package className={`${iconProps} text-blue-500`} />;
    }
  };
  
  // Get background color for icon
  const getIconBgColor = () => {
    switch(iconColor) {
      case 'blue': return 'bg-blue-50';
      case 'purple': return 'bg-purple-50';
      case 'yellow': return 'bg-yellow-50';
      case 'green': return 'bg-green-50';
      default: return 'bg-blue-50';
    }
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="p-6 bg-white shadow-sm rounded-xl animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="w-20 h-8 mb-2 bg-gray-200 rounded"></div>
        <div className="w-32 h-3 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="p-6 transition-all bg-white shadow-sm rounded-xl hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="font-medium text-gray-500">{title}</div>
        <div className={`p-2 ${getIconBgColor()} rounded-lg transition-colors`}>
          <IconComponent />
        </div>
      </div>
      <div className="mb-2 text-3xl font-bold text-gray-900">
        {formattedValue}
      </div>
      
    </div>
  );
}