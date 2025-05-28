import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import dashboardService from '@/services/api/dashboardService';

function RevenueChart() {
  const [revenueData, setRevenueData] = useState([]);
  const [filterType, setFilterType] = useState('daily');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRevenueData();
  }, [filterType]);

  const fetchRevenueData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await dashboardService.getRevenueData(filterType);
      
      if (response.success) {
        const formattedData = response.data.data.map(item => ({
          period: formatPeriodLabel(item.period, filterType),
          revenue: item.total_revenue,
          orders: item.order_count,
          originalPeriod: item.period
        }));
        setRevenueData(formattedData);
      } else {
        setError(response.error);
      }
    } catch (err) {
      console.error('Revenue fetch error:', err);
      setError('Failed to load revenue data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPeriodLabel = (period, type) => {
    const date = new Date(period);
    switch (type) {
      case 'daily':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'weekly':
        return `Week ${Math.ceil(date.getDate() / 7)}`;
      case 'monthly':
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      case 'yearly':
        return date.getFullYear().toString();
      default:
        return period;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="max-w-xs p-2 bg-white border border-gray-200 rounded-lg shadow-lg sm:p-3">
          <p className="text-xs font-medium text-gray-800 sm:text-sm">{label}</p>
          <p className="text-xs text-green-600 sm:text-sm">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
          {payload[0].payload.orders && (
            <p className="text-xs text-blue-600 sm:text-sm">
              Orders: {payload[0].payload.orders}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-4 md:p-6">
        <div className="animate-pulse">
          <div className="w-1/2 h-4 mb-3 bg-gray-200 rounded sm:w-1/3 sm:h-6 sm:mb-4"></div>
          <div className="h-48 bg-gray-200 rounded sm:h-56 md:h-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col mb-4 space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:mb-6">
        <div className="flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-green-600 sm:w-5 sm:h-5" />
          <h3 className="text-base font-semibold text-gray-800 sm:text-lg">Revenue Chart</h3>
        </div>
        
        {/* Filter Buttons - Mobile responsive */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex p-1 overflow-x-auto bg-gray-100 rounded-lg">
            {['daily', 'weekly', 'monthly', 'yearly'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                  filterType === filter 
                    ? 'bg-white text-gray-800 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-3 mb-3 text-red-700 bg-red-100 border border-red-200 rounded-lg sm:p-4 sm:mb-4">
          <p className="text-xs sm:text-sm">{error}</p>
        </div>
      )}

      {/* Chart Container - Responsive height */}
      <div className="h-48 sm:h-56 md:h-64 lg:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={revenueData}
            margin={{ 
              top: 5, 
              right: window.innerWidth < 640 ? 5 : 30, 
              left: window.innerWidth < 640 ? 5 : 20, 
              bottom: 5 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="period" 
              stroke="#6b7280"
              fontSize={window.innerWidth < 640 ? 10 : 12}
              tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
              interval={window.innerWidth < 640 ? 'preserveStartEnd' : 0}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={window.innerWidth < 640 ? 10 : 12}
              tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
              tickFormatter={(value) => {
                if (window.innerWidth < 640) {
                  return `$${(value / 1000).toFixed(0)}k`;
                }
                return `$${(value / 1000).toFixed(0)}k`;
              }}
              width={window.innerWidth < 640 ? 40 : 60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              strokeWidth={window.innerWidth < 640 ? 2 : 3}
              dot={{ 
                fill: '#10b981', 
                strokeWidth: window.innerWidth < 640 ? 1 : 2, 
                r: window.innerWidth < 640 ? 3 : 4 
              }}
              activeDot={{ 
                r: window.innerWidth < 640 ? 4 : 6, 
                fill: '#059669' 
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Empty State */}
      {!isLoading && revenueData.length === 0 && (
        <div className="py-6 text-center sm:py-8">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400 sm:w-12 sm:h-12 sm:mb-3" />
          <p className="px-2 text-sm text-gray-600 sm:text-base">
            No revenue data available for the selected period
          </p>
        </div>
      )}
    </div>
  );
}

export default RevenueChart;