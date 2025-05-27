'use client';

import { useState, useEffect } from 'react';
import { fetchMyOrders } from '../../../services/api/orderService';
import { useAuth } from '../../../context/AuthContext/AuthContext';

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
        // Paginated response
        setOrders(response.results);
        setPagination({
          count: response.count,
          next: response.next,
          previous: response.previous,
          currentPage: filters.page,
          totalPages: Math.ceil(response.count / filters.page_size)
        });
      } else {
        // Non-paginated response (fallback)
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
      // Load counts for each status
      const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      const counts = { all: 0 };
      
      // Get all orders count
      const allOrdersResponse = await fetchMyOrders({ page: 1, page_size: 1 });
      counts.all = allOrdersResponse.count || 0;
      
      // Get count for each status
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
      page: 1 // Reset to first page when changing page size
    }));
  };

  const handleStatusFilter = (status) => {
    // Load status counts only when user clicks on a filter button
    if (!statusCountsLoaded) {
      loadStatusCounts();
    }
    
    setFilters(prev => ({ 
      ...prev, 
      status, 
      page: 1 // Reset to first page when changing filter
    }));
  };

  const handleSearchChange = (search) => {
    setFilters(prev => ({ 
      ...prev, 
      search, 
      page: 1 // Reset to first page when searching
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'processing': 'bg-orange-50 text-orange-700 border-orange-200',
      'shipped': 'bg-purple-50 text-purple-700 border-purple-200',
      'delivered': 'bg-green-50 text-green-700 border-green-200',
      'cancelled': 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const { currentPage, totalPages } = pagination;
    
    // Always show first page
    if (totalPages > 0) {
      pages.push(1);
    }
    
    // Add ellipsis if there's a gap
    if (currentPage > 3) {
      pages.push('...');
    }
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    // Add ellipsis if there's a gap
    if (currentPage < totalPages - 2) {
      if (!pages.includes('...')) {
        pages.push('...');
      }
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }
    
    return pages;
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Orders</h1>
          <p className="mt-1 text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filters and Controls */}
        <div className="p-4 mb-6 bg-white border rounded-lg shadow-sm">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search orders by order number, product name..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filters.status === status
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {statusCounts[status] !== undefined && (
                  <span className="ml-1 text-xs">
                    ({statusCounts[status]})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        {!loading && !error && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {orders.length > 0 ? (pagination.currentPage - 1) * filters.page_size + 1 : 0} - {Math.min((pagination.currentPage - 1) * filters.page_size + orders.length, pagination.count)} of {pagination.count} orders
            {filters.status !== 'all' && ` (${filters.status})`}
            {filters.search && ` matching "${filters.search}"`}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 text-center border border-red-200 rounded-lg bg-red-50">
            <p className="text-red-700">{error}</p>
            <button
              onClick={loadOrders}
              className="px-4 py-2 mt-3 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="p-8 text-center bg-white border rounded-lg shadow-sm">
            <div className="mb-3 text-gray-300">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="mb-1 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="text-gray-500">
              {filters.search 
                ? `No orders found matching "${filters.search}"`
                : filters.status === 'all' 
                  ? "You haven't placed any orders yet." 
                  : `No ${filters.status} orders found.`
              }
            </p>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md">
                {/* Order Header */}
                <div className="p-4 border-b border-gray-100 sm:p-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Order #{order.order_number}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-3">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-12 h-12 overflow-hidden bg-gray-100 rounded-lg sm:w-16 sm:h-16">
                          {item.product_thumbnail_image ? (
                           <img
                              src={`${process.env.NEXT_PUBLIC_API_URL}${item.product_thumbnail_image}`}
                              alt={item.product_name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 sm:text-base line-clamp-2">
                            {item.product_name}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium text-gray-900">{order.full_name}</p>
                        <p>{order.shipping_address}</p>
                        <p>{order.city}, {order.state} {order.zip_code}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 p-4 mt-6 bg-white border rounded-lg shadow-sm sm:flex-row">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.previous}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                pagination.previous
                  ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {renderPaginationNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                  disabled={page === '...'}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    page === pagination.currentPage
                      ? 'text-white bg-blue-600 border border-blue-600'
                      : page === '...'
                      ? 'text-gray-400 cursor-default'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.next}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                pagination.next
                  ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
              }`}
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;