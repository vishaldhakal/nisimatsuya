"use client";
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  StatCard,
  LoadingState,
  RevenueChart,
  RecentOrdersTable
} from '../../components/features/admin/index';

import { useRouter } from 'next/navigation';
import dashboardService from '../../services/api/dashboardService';
import { fetchOrders } from '../../services/api/orderService';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]); // Add state for recent orders
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true); // Separate loading state for orders
  const [error, setError] = useState(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [router]);

  /**
   * Fetch both dashboard statistics and recent orders
   */
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch dashboard stats and recent orders concurrently
      const [statsResponse, ordersResponse] = await Promise.allSettled([
        fetchDashboardStats(),
        fetchRecentOrders()
      ]);

      // Handle stats response
      if (statsResponse.status === 'rejected') {
        console.error('Stats fetch failed:', statsResponse.reason);
        setError('Failed to load dashboard statistics');
      }

      // Handle orders response
      if (ordersResponse.status === 'rejected') {
        console.error('Orders fetch failed:', ordersResponse.reason);
        // Don't set main error for orders failure, just log it
      }

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch dashboard statistics from API
   */
  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardService.getDashboardStats();
      if (response.success) {
        setStats({
          totalProducts: response.data.total_products,
          totalOrders: response.data.total_orders,
          pendingOrders: response.data.pending_orders,
          revenue: response.data.total_revenue
        });
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('Dashboard stats fetch error:', err);
      throw err;
    }
  };

  /**
   * Fetch recent 5 orders
   */
  const fetchRecentOrders = async () => {
    try {
      setIsOrdersLoading(true);
      const response = await fetchOrders({
        page: 1,
        page_size: 5 // Fetch only 5 recent orders
      });
      
      // Handle both paginated and non-paginated responses
      const orders = response.results || response.data || response;
      setRecentOrders(Array.isArray(orders) ? orders : []);
    } catch (err) {
      console.error('Recent orders fetch error:', err);
      setRecentOrders([]); // Set empty array on error
    } finally {
      setIsOrdersLoading(false);
    }
  };

  /**
   * Refresh data handler
   */
  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 font-semibold text-gray-800 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-100 disabled:opacity-50"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-200 rounded-lg">
            <p className="font-medium">Error loading dashboard data</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="Package"
            iconColor="blue"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="ShoppingCart"
            iconColor="purple"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon="Clock"
            iconColor="yellow"
          />
          <StatCard
            title="Total Revenue"
            value={stats.revenue}
            icon="DollarSign"
            iconColor="green"
            isCurrency={true}
          />
        </div>

        {/* Revenue Chart Section */}
        <div className="mb-8">
          <RevenueChart />
        </div>

        {/* Recent Orders Section */}
        <div className="mb-8">
          {isOrdersLoading ? (
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Recent Orders</h3>
              </div>
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
                <span className="ml-2 text-gray-500">Loading orders...</span>
              </div>
            </div>
          ) : (
            <RecentOrdersTable orders={recentOrders} />
          )}
        </div>
      </div>
    </div>
  );
}