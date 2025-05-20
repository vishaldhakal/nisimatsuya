"use client";

import { useState, useEffect } from 'react';
import { 
  BarChart, 
  LineChart, 
  Area, 
  AreaChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Bar, 
  Line 
} from 'recharts';
import { 
  Package, 
  ShoppingCart, 
  Clock, 
  DollarSign, 
  TrendingUp,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for data fetching
    setTimeout(() => {
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');

      const revenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const completedOrders = orders.filter(order => order.status === 'completed').length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders,
        completedOrders,
        revenue
      });

      const sortedOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentOrders(sortedOrders);
      
      // Generate mock sales data for chart visualization
      const mockSalesData = generateMockSalesData(orders);
      setSalesData(mockSalesData);
      
      setIsLoading(false);
    }, 800);
  }, []);

  // Function to generate mock sales data based on available orders
  const generateMockSalesData = (orders) => {
    // Create a map to store sales by date
    const salesByDate = {};
    const ordersByDate = {};
    
    // Get last 7 days
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dates.push(dateString);
      salesByDate[dateString] = 0;
      ordersByDate[dateString] = 0;
    }
    
    // Default values for today based on the actual orders data we have
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Use actual data for today
    const totalAmount = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalOrderCount = orders.length;
    
    salesByDate[today] = totalAmount;
    ordersByDate[today] = totalOrderCount;
    
    // Add some realistic data for previous days to show trends
    dates.forEach((date, index) => {
      if (date !== today) {
        // Create some variation in historical data
        const factor = 0.7 + Math.random() * 0.5; // Random factor between 0.7 and 1.2
        const dayFactor = 1 - (index * 0.05); // Slight downward trend as we go back in time
        
        salesByDate[date] = index === dates.length - 2 ? 
          totalAmount * 0.9 * dayFactor : // Yesterday was slightly less
          Math.max(100, totalAmount * factor * dayFactor);
          
        ordersByDate[date] = index === dates.length - 2 ? 
          Math.max(1, Math.floor(totalOrderCount * 0.9 * dayFactor)) : // Yesterday was slightly less
          Math.max(1, Math.floor(totalOrderCount * factor * dayFactor));
      }
    });
    
    // Convert to array format for Recharts
    return dates.map(date => ({
      date,
      sales: salesByDate[date],
      orders: ordersByDate[date]
    }));
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString(undefined, { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="mt-4 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-200 rounded shadow-sm flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh Data
          </button>
        </div>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium text-gray-500">Total Products</div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalProducts}</div>
            <div className="text-sm text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" /> +2.5% from last month
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium text-gray-500">Total Orders</div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalOrders}</div>
            <div className="text-sm text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" /> +5.2% from last month
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium text-gray-500">Pending Orders</div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.pendingOrders}</div>
            <div className="flex justify-between text-sm">
              <div className="text-yellow-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" /> Needs attention
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium text-gray-500">Total Revenue</div>
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatCurrency(stats.revenue)}
            </div>
            <div className="text-sm text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" /> +8.1% from last month
            </div>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium mb-4">Sales Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value, name) => {
                  if (name === 'sales') return formatCurrency(value);
                  return value;
                }} />
                <Area type="monotone" dataKey="sales" stroke="#6366F1" fillOpacity={1} fill="url(#colorSales)" name="Sales" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium mb-4">Order Statistics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="orders" fill="#A78BFA" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Recent Orders</h3>
            <Link href="/admin/orders" >
             <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All Orders</button>
            </Link>
           
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <ShoppingCart className="w-12 h-12 mb-3 text-gray-400" />
              <p>No recent orders found</p>
              <p className="text-sm mt-1">New orders will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order, idx) => (
                    <tr key={order.id || idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id || `00${idx + 1}`}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer || 'Customer ' + (idx + 1)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt || new Date()).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}