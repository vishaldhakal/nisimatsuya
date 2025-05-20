"use client";

import { 
  Package, 
  ShoppingCart, 
  Clock, 
  DollarSign, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  icon, 
  iconColor, 
  trend, 
  trendDirection,
  isCurrency = false 
}) {
  // Format currency if needed
  const formattedValue = isCurrency 
    ? Number(value).toLocaleString(undefined, { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })
    : value;

  // Get the appropriate icon component
  const IconComponent = () => {
    switch(icon) {
      case 'Package':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'ShoppingCart':
        return <ShoppingCart className="w-6 h-6 text-purple-500" />;
      case 'Clock':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'DollarSign':
        return <DollarSign className="w-6 h-6 text-green-500" />;
      default:
        return <Package className="w-6 h-6 text-blue-500" />;
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
  
  // Get trend indicator
  const TrendIndicator = () => {
    if (trendDirection === 'up') {
      return (
        <div className="text-sm text-green-600 flex items-center">
          <TrendingUp className="w-4 h-4 mr-1" /> {trend}
        </div>
      );
    } else if (trendDirection === 'alert') {
      return (
        <div className="text-sm text-yellow-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" /> {trend}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="font-medium text-gray-500">{title}</div>
        <div className={`p-2 ${getIconBgColor()} rounded-lg`}>
          <IconComponent />
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{formattedValue}</div>
      <TrendIndicator />
    </div>
  );
}