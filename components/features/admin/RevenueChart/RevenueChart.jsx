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
        <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-green-600">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
          {payload[0].payload.orders && (
            <p className="text-blue-600">
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
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="animate-pulse">
          <div className="w-1/3 h-6 mb-4 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Revenue Chart</h3>
        </div>
        <div className="flex items-center space-x-3">
          {/* Filter Buttons */}
          <div className="flex p-1 bg-gray-100 rounded-lg">
            {['daily', 'weekly', 'monthly','yearly'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-3 py-1 rounded text-sm font-medium capitalize transition-colors ${
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
        <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-200 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="period" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#059669' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Empty State */}
      {!isLoading && revenueData.length === 0 && (
        <div className="py-8 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600">No revenue data available for the selected period</p>
        </div>
      )}
    </div>
  );
}

export default RevenueChart;