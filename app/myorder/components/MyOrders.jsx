'use client';

import { useState, useEffect } from 'react';
import { fetchMyOrders } from '../../../services/api/orderService';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import OrderFilters from './OrderFilters';
import OrdersList from './OrdersList';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 1
  });
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    page_size: 5
  });
  const [statusCounts, setStatusCounts] = useState({});
  const [statusCountsLoaded, setStatusCountsLoaded] = useState(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [filters, isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchMyOrders(filters);
      
      if (response.results) {
        setOrders(response.results);
        setPagination({
          count: response.count,
          next: response.next,
          previous: response.previous,
          currentPage: filters.page,
          totalPages: Math.ceil(response.count / filters.page_size)
        });
      } else {
        setOrders(Array.isArray(response) ? response : []);
        setPagination({
          count: Array.isArray(response) ? response.length : 0,
          next: null,
          previous: null,
          currentPage: 1,
          totalPages: 1
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStatusCounts = async () => {
    try {
      setStatusCountsLoaded(true);
      const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      const counts = { all: 0 };
      
      const allOrdersResponse = await fetchMyOrders({ page: 1, page_size: 1 });
      counts.all = allOrdersResponse.count || 0;
      
      for (const status of statuses) {
        try {
          const statusResponse = await fetchMyOrders({ status, page: 1, page_size: 1 });
          counts[status] = statusResponse.count || 0;
        } catch (err) {
          counts[status] = 0;
        }
      }
      
      setStatusCounts(counts);
    } catch (err) {
      console.error('Failed to load status counts:', err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setFilters(prev => ({ 
      ...prev, 
      page_size: newPageSize,
      page: 1
    }));
  };

  const handleStatusFilter = (status) => {
    if (!statusCountsLoaded) {
      loadStatusCounts();
    }
    
    setFilters(prev => ({ 
      ...prev, 
      status, 
      page: 1
    }));
  };

  const handleSearchChange = (search) => {
    setFilters(prev => ({ 
      ...prev, 
      search, 
      page: 1
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to view your orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">My Orders</h1>
          <p className="mt-2 text-lg text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filters */}
        <OrderFilters
          filters={filters}
          statusCounts={statusCounts}
          onStatusFilter={handleStatusFilter}
          onSearchChange={handleSearchChange}
        />

        {/* Results Summary */}
        {!loading && !error && (
          <div className="mb-6 text-sm text-gray-600">
            Showing {orders.length > 0 ? (pagination.currentPage - 1) * filters.page_size + 1 : 0} - {Math.min((pagination.currentPage - 1) * filters.page_size + orders.length, pagination.count)} of {pagination.count} orders
            {filters.status !== 'all' && ` (${filters.status})`}
            {filters.search && ` matching "${filters.search}"`}
          </div>
        )}

        {/* Content */}
        {loading && <LoadingSpinner />}
        
        {error && <ErrorState error={error} onRetry={loadOrders} />}
        
        {!loading && !error && orders.length === 0 && (
          <EmptyState filters={filters} />
        )}
        
        {!loading && !error && orders.length > 0 && (
          <>
            <OrdersList orders={orders} />
            {pagination.totalPages > 1 && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
