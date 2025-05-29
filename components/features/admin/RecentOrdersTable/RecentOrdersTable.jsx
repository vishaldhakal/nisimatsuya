"use client";
import React, { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus as updateOrderStatusAPI } from '../../../../services/api/orderService';
import {
  OrdersTable,
  ErrorAlert,
  EmptyState,
  LoadingSpinner
} from '../../../../app/admin/orders/components'; 
import Link from 'next/link';

export default function RecentOrdersDisplay() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isUpdating, setIsUpdating] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const loadRecentOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the same parameters as AdminOrders but limit to 5 most recent
      const params = {
        page: 1,
        page_size: 5, // Only get 5 orders
        search: '', // No search for recent orders view
        status: undefined, // Show all statuses
        sortBy: sortColumn,
        sortOrder: sortDirection
      };
    
      const ordersData = await fetchOrders(params);
      setOrders(ordersData.results || []);
    } catch (error) {
      console.error("Failed to load recent orders:", error);
      setError(error.message || 'Failed to load recent orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecentOrders();
  }, [sortColumn, sortDirection]);

  const updateOrderStatus = async (orderNumber, status) => {
    setIsUpdating(orderNumber);
    setError(null);

    try {
      const updatedOrder = await updateOrderStatusAPI(orderNumber, status);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.order_number === orderNumber ? { ...order, status: updatedOrder.status } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
      setError(`Failed to update order status: ${error.message}`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="p-3 bg-white shadow-sm sm:p-4 md:p-6 rounded-xl">
      {/* Header */}
      <div className="flex flex-col mb-4 space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:mb-6">
        <h3 className="text-base font-medium text-gray-900 sm:text-lg">Recent Orders</h3>
        <Link href="/admin/orders">
          <button className="self-start text-xs font-medium text-blue-600 sm:text-sm hover:text-blue-800 sm:self-auto">
            View All Orders
          </button>
        </Link>
      </div>

      {error && <ErrorAlert error={error} />}

      {isLoading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <EmptyState searchQuery="" filterStatus="all" />
      ) : (
        <OrdersTable
          orders={orders}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          expandedOrder={expandedOrder}
          onToggleExpand={(orderNumber) => setExpandedOrder(expandedOrder === orderNumber ? null : orderNumber)}
          onUpdateStatus={updateOrderStatus}
          isUpdating={isUpdating}
        />
      )}
      
      {/* Footer showing count */}
      {!isLoading && orders.length > 0 && (
        <div className="mt-4 text-xs text-center text-gray-500">
          Showing {orders.length} most recent order{orders.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}