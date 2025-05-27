"use client";
import React, { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus as updateOrderStatusAPI } from '../../../services/api/orderService';
import {
  SearchFilters,
  OrdersTable,
  Pagination,
  ErrorAlert,
  EmptyState,
  LoadingSpinner
} from './components';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isUpdating, setIsUpdating] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    count: 0, next: null, previous: null, currentPage: 1, totalPages: 1, pageSize: 10
  });

  const loadOrders = async (page = 1, search = '', status = 'all') => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page, page_size: pagination.pageSize, search: search.trim(),
        status: status !== 'all' ? status : undefined, sortBy: sortColumn, sortOrder: sortDirection
      };
    
      const ordersData = await fetchOrders(params);
      setOrders(ordersData.results || []);
      setPagination(prev => ({
        ...prev, count: ordersData.count || 0, next: ordersData.next, previous: ordersData.previous,
        currentPage: page, totalPages: Math.ceil((ordersData.count || 0) / prev.pageSize)
      }));
    } catch (error) {
      console.error("Failed to load orders:", error);
      setError(error.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(pagination.currentPage, searchQuery, filterStatus);
  }, [pagination.currentPage, searchQuery, filterStatus, sortColumn, sortDirection, pagination.pageSize]);

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
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, pageSize: newSize, currentPage: 1 }));
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <SearchFilters
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onRefresh={() => loadOrders(pagination.currentPage, searchQuery, filterStatus)}
        isLoading={isLoading}
      />
 
      {error && <ErrorAlert error={error} />}

      {isLoading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <EmptyState searchQuery={searchQuery} filterStatus={filterStatus} />
      ) : (
        <>
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
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}
    </div>
  );
}