"use client";
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Filter, RefreshCw, CheckCircle, Clock, Truck, XCircle, Package, AlertCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchOrders, updateOrderStatus as updateOrderStatusAPI } from '../../../services/api/orderService';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isUpdating, setIsUpdating] = useState(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const loadOrders = async (page = 1, search = '', status = 'all') => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page,
        page_size: pagination.pageSize,
        search: search.trim(),
        status: status !== 'all' ? status : undefined,
        sortBy: sortColumn,
        sortOrder: sortDirection
      };

      const ordersData = await fetchOrders(params);
      setOrders(ordersData.results || []);
      setPagination(prev => ({
        ...prev,
        count: ordersData.count || 0,
        next: ordersData.next,
        previous: ordersData.previous,
        currentPage: page,
        totalPages: Math.ceil((ordersData.count || 0) / prev.pageSize)
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
    // eslint-disable-next-line
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
      setTimeout(() => {
        setError(null);
      }, 5000);
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
    const query = e.target.value;
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const refreshOrders = () => {
    loadOrders(pagination.currentPage, searchQuery, filterStatus);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

  const handlePreviousPage = () => {
    if (pagination.previous) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  const handleNextPage = () => {
    if (pagination.next) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPagination(prev => ({
      ...prev,
      pageSize: newSize,
      currentPage: 1
    }));
  };

  // Pagination info
  const startItem = (pagination.currentPage - 1) * pagination.pageSize + 1;
  const endItem = Math.min(pagination.currentPage * pagination.pageSize, pagination.count);

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <RefreshCw className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numericAmount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const SortIcon = ({ column }) => (
    <span className="inline-flex ml-1">
      {sortColumn === column ? (
        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4 opacity-30" />
      )}
    </span>
  );

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
        <div className="flex flex-col gap-3 mt-3 sm:mt-0 sm:flex-row">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by customer name or order ID..."
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full py-2 pl-10 pr-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <select
              className="block w-full py-2 pl-3 pr-10 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <Filter className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={refreshOrders}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 border border-red-200 rounded-md bg-red-50">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg shadow">
          <Package className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery 
              ? `No orders found matching "${searchQuery}".`
              : filterStatus !== 'all' 
                ? `There are no orders with status "${filterStatus}".`
                : "No orders have been placed yet."
            }
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center">
                        Order ID
                        <SortIcon column="id" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                      onClick={() => handleSort('customer_name')}
                    >
                      <div className="flex items-center">
                        Customer
                        <SortIcon column="customer_name" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="hidden px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer sm:table-cell"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        Date
                        <SortIcon column="date" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center">
                        Amount
                        <SortIcon column="amount" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Status
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(orders) && orders.map((order) => (
                    <tr key={order.order_number} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {order.order_number}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.full_name || 'N/A'}
                        </div>
                      </td>
                      <td className="hidden px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:table-cell">
                        {formatDate(order.created_at || order.date)}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {formatCurrency(order.total_amount || order.totalAmount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status || 'pending'}</span>
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => updateOrderStatus(order.order_number, e.target.value)}
                          disabled={isUpdating === order.order_number}
                          className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {isUpdating === order.order_number && (
                          <div className="flex justify-center mt-1">
                            <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex justify-between flex-1 sm:hidden">
              <button
                onClick={handlePreviousPage}
                disabled={!pagination.previous}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={!pagination.next}
                className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startItem}</span> to{' '}
                  <span className="font-medium">{endItem}</span> of{' '}
                  <span className="font-medium">{pagination.count}</span> results
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Page Size Selector */}
                <div>
                  <label htmlFor="pageSize" className="sr-only">
                    Page size
                  </label>
                  <select
                    id="pageSize"
                    value={pagination.pageSize}
                    onChange={handlePageSizeChange}
                    className="block px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {/* Pagination Numbers */}
                <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={handlePreviousPage}
                    disabled={!pagination.previous}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                  </button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                          pagination.currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={handleNextPage}
                    disabled={!pagination.next}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}