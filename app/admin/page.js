"use client";

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  StatCard,
  SalesChart,
  OrdersChart,
  RecentOrdersTable,
  LoadingState
} from '../../components/features/admin/index';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
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
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [router]);

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

  if (isLoading) {
    return <LoadingState />;
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
          <StatCard 
            title="Total Products"
            value={stats.totalProducts}
            icon="Package"
            iconColor="blue"
            trend="+2.5% from last month"
            trendDirection="up"
          />
          
          <StatCard 
            title="Total Orders"
            value={stats.totalOrders}
            icon="ShoppingCart"
            iconColor="purple"
            trend="+5.2% from last month"
            trendDirection="up"
          />
          
          <StatCard 
            title="Pending Orders"
            value={stats.pendingOrders}
            icon="Clock"
            iconColor="yellow"
            trend="Needs attention"
            trendDirection="alert"
          />
          
          <StatCard 
            title="Total Revenue"
            value={stats.revenue}
            icon="DollarSign"
            iconColor="green"
            trend="+8.1% from last month"
            trendDirection="up"
            isCurrency={true}
          />
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ml-2 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium mb-4">Sales Overview</h3>
            <SalesChart data={salesData} />
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium mb-4">Order Statistics</h3>
            <OrdersChart data={salesData} />
          </div>
        </div>
        
        {/* Recent Orders */}
        <RecentOrdersTable orders={recentOrders} />
      </div>
    </div>
  );
}